<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Available Books</h1>

      <!-- Select for category filter -->
      <div class="mb-4">
        <label for="category" class="block text-lg font-medium text-gray-700"
          >Filter by Category:</label
        >
        <select
          id="category"
          v-model="selectedCategory"
          class="mt-1 block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Show the preloader if isLoading is true and books is empty -->
      <div
        v-if="bookStore.isLoading && (!books || books.length === 0)"
        class="flex justify-center items-center"
      >
        <div class="spinner">Loading...</div>
      </div>

      <!-- Table view for books -->
      <div
        v-else-if="filteredBooks && filteredBooks.length > 0"
        class="overflow-x-auto"
      >
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
                Reservation
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.id">
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
                <!-- Check if the book is reservable or not -->
                <template v-if="isBookReservable(book)">
                  <router-link
                    :to="{ name: 'BookReserve', params: { id: book.id } }"
                    class="bg-blue-500 text-white px-4 py-2 rounded"
                    >Reserve</router-link
                  >
                </template>
                <template v-else>
                  <p
                    v-if="
                      book.reservations && book.reservations.status === 'Active'
                    "
                    class="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Not available .
                  </p>
                  <p v-else class="text-gray-500">
                    Not available for reservation.
                  </p>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Handle the case where there are no books -->
      <div v-else>
        <p>No hay libros disponibles.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { useBookStore } from "../stores/books";

export default defineComponent({
  setup() {
    const bookStore = useBookStore();
    const books = ref([]);
    const categories = ref([]);
    const selectedCategory = ref("");

    onMounted(async () => {
      try {
        const fetchedBooks = await bookStore.fetchBooks();
        books.value = fetchedBooks || [];
        categories.value = [
          ...new Set(books.value.map((book) => book.category)),
        ];
      } catch (error) {
        console.error("Failed to fetch books:", error);
        books.value = [];
      }
    });

    const filteredBooks = computed(() => {
      if (!selectedCategory.value) {
        return books.value;
      }
      return books.value.filter(
        (book) => book.category.id === selectedCategory.value
      );
    });

    const isBookReservable = (book) => {
      return !book.reservations || book.reservations.status === "Not Active";
    };

    return {
      books,
      bookStore,
      categories,
      selectedCategory,
      filteredBooks,
      isBookReservable,
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
