<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">User Reserved Books</h1>

      <!-- User Details -->
      <div v-if="user" class="mb-6">
        <h3 class="text-xl font-semibold">User Information</h3>

        <!-- User Name, Reservation Count, and Profile Image -->
        <div class="flex items-center space-x-4">
          <!-- User Image with dashed border -->
          <div
            class="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
          >
            <img
              v-if="user.image"
              :src="user.image"
              alt="User Profile"
              class="w-24 h-24 object-cover rounded-full mx-auto"
            />
            <div v-else class="text-gray-500">No Image</div>
          </div>
          <!-- User Info Text -->
          <div>
            <p class="font-medium text-gray-700">Name: {{ user.name }}</p>
            <p class="text-gray-500">Email: {{ user.email }}</p>
            <p class="text-sm text-gray-600">
              Total Reservations: {{ reservedBooks.length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Show the preloader if isLoading is true and reservedBooks is empty -->
      <div
        v-if="isLoading && (!reservedBooks || reservedBooks.length === 0)"
        class="flex justify-center items-center"
      >
        <div class="spinner">Loading...</div>
      </div>

      <!-- Table view for reserved books -->
      <div
        v-else-if="reservedBooks && reservedBooks.length > 0"
        class="overflow-x-auto"
      >
        sutitilo mis reservations
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th
                class="px-6 py-3 border-b text-left text-sm font-medium text-gray-700"
              >
                Title
              </th>
              <th
                class="px-6 py-3 border-b text-left text-sm font-medium text-gray-700"
              >
                Author
              </th>
              <th
                class="px-6 py-3 border-b text-left text-sm font-medium text-gray-700"
              >
                Category
              </th>
              <th
                class="px-6 py-3 border-b text-left text-sm font-medium text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in reservedBooks" :key="book.id">
              <td class="px-6 py-4 border-b text-sm text-gray-700">
                {{ book.title }}
              </td>
              <td class="px-6 py-4 border-b text-sm text-gray-700">
                {{ book.author }}
              </td>
              <td class="px-6 py-4 border-b text-sm text-gray-700">
                {{ book.category.name }}
              </td>
              <td class="px-6 py-4 border-b text-sm text-gray-700">
                <button
                  @click="cancelReservation(book.reservations.id)"
                  :disabled="isSubmitting"
                  class="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel Reservation
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

export default defineComponent({
  setup() {
    const ReservationStore = useReservationStore();
    const authStore = useAuthStore();
    const reservedBooks = ref([]);
    const isLoading = ref(true);
    const user = ref(null);
    const isSubmitting = ref(false);

    onMounted(async () => {
      try {
        const fetchedUser = await authStore.getUser();
        user.value = fetchedUser || null;

        const fetchedReservedBooks = await ReservationStore.fetchReservations();
        reservedBooks.value = fetchedReservedBooks || [];
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        isLoading.value = false;
      }
    });

    // Function to cancel the reservation
    const cancelReservation = async (reservationsId) => {

      try {
         isSubmitting.value = true;
        // Datos a actualizar: cambiar el estado de la reserva a "Not Active"
        const data = { status: "Not Active" };

        // Actualizar la reserva con el nuevo estado
        await ReservationStore.updateReservation(reservationsId, data);

        // Refrescar la lista después de la actualización
        const updatedReservedBooks = await ReservationStore.fetchReservations();
        reservedBooks.value = updatedReservedBooks || [];
      } catch (error) {
        console.error("No se pudo cancelar la reserva:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      user,
      reservedBooks,
      isLoading,
      cancelReservation,
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
