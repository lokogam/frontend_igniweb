<template>
  <div class="container mx-auto p-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <!-- Book Title Header -->
      <div class="mb-4">
        <label class="font-bold text-lg">Book title:</label>
        <div>{{ book?.title || "The Count of Montecristo" }}</div>
      </div>

      <!-- Author -->
      <div class="mb-4">
        <label class="font-bold text-lg">Author:</label>
        <div>{{ book?.author || "Alexandre Dumas" }}</div>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label class="font-bold text-lg">Description:</label>
        <div class="text-gray-600">
          {{
            book?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          }}
        </div>
      </div>

      <!-- Book Image Placeholder -->
      <div
        class="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
      >
        <div class="text-gray-500">Book image</div>
      </div>

      <!-- Reservation Form -->
      <form @submit.prevent="reserveBook">
        <!-- Days Input -->
        <div class="mb-4">
          <label class="block font-bold text-lg mb-2">Days:</label>
          <input
            type="number"
            v-model.number="days"
            min="1"
            class="w-20 p-2 border rounded"
          />
        </div>

         <!-- Reserve Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <span v-if="isSubmitting">Reserving...</span>
          <span v-else>Reserve</span>
        </button>
      </form>

      <!-- Error Messages -->
      <div v-if="errors.length" class="mt-4 text-red-500">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBookStore } from "../stores/books";
import { useAuthStore } from "../stores/auth";
import { useReservationStore } from "../stores/reservations";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const bookStore = useBookStore();
    const authStore = useAuthStore();
    const reservationStore = useReservationStore();


    const book = ref(null);
    const days = ref(1);
    const errors = ref([]);
    const isSubmitting = ref(false);

    onMounted(async () => {
      await authStore.getUser();
      try {
        book.value = await bookStore.fetchBook(route.params.id);
      } catch (error) {
        errors.value = ["Error loading book details"];
      }
    });

    const reserveBook = async () => {
      errors.value = [];
      isSubmitting.value = true;
      try {

        if (book.value.reservations?.status === "Active") {
          throw new Error("This book is already reserved");
        }

        await reservationStore.createReservation({
          book_id: book.value.id,
          user_id: authStore.user.id,
          reservation_days: days.value || 1,
          status: "Active",
        });       

        // Redirigir a la ruta de libros reservados del usuario
         router.push({ path: "/user-reserved-books" });
      } catch (error) {
        errors.value = [error.message];
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      book,
      days,
      errors,
      reserveBook,
    };
  },
});
</script>
