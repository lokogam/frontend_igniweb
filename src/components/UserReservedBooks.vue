<template>
  <div>
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">User Reserved Books</h2>

      <!-- User Details -->
      <div v-if="user" class="mb-6">
        <h3 class="text-xl font-semibold">User Information</h3>
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      </div>

      <!-- Show the preloader if isLoading is true and reservedBooks is empty -->
      <div
        v-if="isLoading && (!reservedBooks || reservedBooks.length === 0)"
        class="flex justify-center items-center"
      >
        <div class="spinner">Loading...</div>
      </div>

      <!-- Show reserved books when not loading -->
      <div
        v-else-if="reservedBooks && reservedBooks.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <BookCard v-for="book in reservedBooks" :key="book.id" :book="book" />
      </div>

      <!-- Handle the case where there are no reserved books -->
      <div v-else>
        <p>No reserved books available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useReservationStore } from "../stores/reservations";
import { useAuthStore } from "../stores/auth";
import BookCard from "./BookCard.vue";

export default defineComponent({
  components: { BookCard },
  setup() {
    const ReservationStore = useReservationStore();
    const authStore = useAuthStore();
    const reservedBooks = ref([]);
    const isLoading = ref(true);
    const user = ref(null);

    onMounted(async () => {
      try {
        const fetchedUser = await authStore.getUser();
        user.value = fetchedUser || null;

        const fetchedReservedBooks =
          await ReservationStore.fetchReservations();

        reservedBooks.value = fetchedReservedBooks || [];

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      user,
      reservedBooks,
      isLoading,
    };
  },
});
</script>

<style>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
