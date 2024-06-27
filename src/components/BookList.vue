<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Available Books</h1>

      <!-- Show the preloader if isLoading is true and books is empty -->
      <div v-if="bookStore.isLoading && (!books || books.length === 0)" class="flex justify-center items-center">
        <div class="spinner">Loading...</div>
      </div>

      <!-- Show books when not loading -->
      <div v-else-if="books && books.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>

      <!-- Handle the case where there are no books -->
      <div v-else>
        <p>No hay libros disponibles.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import BookCard from "./BookCard.vue";
import { useBookStore } from "../stores/books";

export default defineComponent({
  components: { BookCard },
  setup() {
    const bookStore = useBookStore();
    const books = ref([]);

    onMounted(async () => {
      try {
        const fetchedBooks = await bookStore.fetchBooks();
        // console.log('Fetched books:', fetchedBooks);
        books.value = fetchedBooks || [];
      } catch (error) {
        console.error("Failed to fetch books:", error);
        books.value = [];
      }
    });

    return {
      books,
      bookStore,
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
