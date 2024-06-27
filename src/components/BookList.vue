<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Available Books</h1>

      <!-- Select for category filter -->
      <div class="mb-4">
        <label for="category" class="block text-lg font-medium text-gray-700">Filter by Category:</label>
        <select id="category" v-model="selectedCategory" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="">All</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <!-- Show the preloader if isLoading is true and books is empty -->
      <div v-if="bookStore.isLoading && (!books || books.length === 0)" class="flex justify-center items-center">
        <div class="spinner">Loading...</div>
      </div>

      <!-- Show books when not loading -->
      <div v-else-if="filteredBooks && filteredBooks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
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
import BookCard from "./BookCard.vue";
import { useBookStore } from "../stores/books";

export default defineComponent({
  components: { BookCard },
  setup() {
    const bookStore = useBookStore();
    const books = ref([]);
    const categories = ref([]);
    const selectedCategory = ref("");

    onMounted(async () => {
      try {
        const fetchedBooks = await bookStore.fetchBooks();
        books.value = fetchedBooks || [];
        categories.value = [...new Set(books.value.map(book => book.category))];
      } catch (error) {
        console.error("Failed to fetch books:", error);
        books.value = [];
      }
    });

    const filteredBooks = computed(() => {
      console.log('selectedCategory', selectedCategory.value);
      if (!selectedCategory.value) {
        return books.value;
      }
      return books.value.filter(book => book.category.id === selectedCategory.value);
    });

    return {
      books,
      bookStore,
      categories,
      selectedCategory,
      filteredBooks,
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
