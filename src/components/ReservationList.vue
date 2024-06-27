<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Reserve Book</h1>
      <div v-if="book" class="bg-white p-8 rounded shadow-md">
        <img
          v-if="book.image"
          :src="book.image"
          alt="Book Image"
          class="w-32 h-48 mb-4"
        />
        <h2 class="text-2xl font-bold mb-2">{{ book.title }}</h2>
        <p class="text-gray-700 mb-4">{{ book.author }}</p>
        <p class="text-gray-700 mb-4">{{ book.description }}</p>
        <form @submit.prevent="reserveBook">
          <label class="block mb-1">Days to Reserve</label>
          <input
            type="number"
            v-model.number="days"
            class="w-full px-3 py-2 border rounded mb-4"
          />

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded"
          >
            Reserve
          </button>
        </form>
        <p v-if="errors.length > 0" class="text-red-500 mt-4">
          <span v-for="error in errors" :key="error">{{ error }}</span>
        </p>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useBookStore } from "../stores/books";
import { useAuthStore } from "../stores/auth";
import { useReservationStore  } from "../stores/reservations";

export default defineComponent({
  setup() {
    const route = useRoute();
    const id = ref(route.params.id);
    const bookStore = useBookStore();
    const authStore = useAuthStore();
    const reservationStore = useReservationStore(); 
    const book = ref(null);
    const days = ref(1);
    const errors = ref([]);

    onMounted(async () => {
      await authStore.getUser();
      try {
        book.value = await bookStore.fetchBook(id.value);
        console.log('book.value',book.value);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    });

    const reserveBook = async () => {
      try {
        if (!book.value) {
          throw new Error("Book is not loaded yet");
        }
        if (book.value.reservations.status === "active") {
          console.log('YA ESTE RESERVADO ');
          return;
        }
        const data = {
          book_id: book.value.id,
          user_id: authStore.user.id,
          reservation_days: days.value,
          status: "active",
        };
        await reservationStore.createReservation(data);
        console.log('Reservation created successfully');
        // Optionally, you can clear form fields or show success message here
      } catch (error) {
        // Handle errors more gracefully
        if (error.response && error.response.data && error.response.data.errors) {
          errors.value = error.response.data.errors;
        } else {
          errors.value = [error.message]; // Fallback to general error message
        }
        console.error("Error creating reservation:", error);
      }
    };

    return {
      book,
      days,
      reserveBook,
      errors,
    };
  },
});
</script>
