import { defineStore } from "pinia";
import axios from "axios";

export const useBookStore = defineStore("books", {
  state: () => ({
    books: [],
    book: null,
    errors: [],
    isLoading: false,
  }),
  actions: {
    async fetchBooks() {
      this.isLoading = true;
      try {
        const response = await axios.get("/api/books");
        this.books = response.data;
        // console.log("this.books", this.books);
        return this.books;
      } catch (error) {
        console.error("Error al obtener los libros:", error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    async fetchBook(id) {
      try {
        const response = await axios.get(`/api/books/${id}`);
        this.book = response.data;
        // console.log("book", response.data);
        return this.book;
      } catch (error) {
        console.error("Error al obtener el libro:", error);
      }
    },
    async searchBooks(title) {
      try {
        const response = await axios.get(`/api/books/search/${title}`);
        this.books = response.data;
      } catch (error) {
        console.error("Error al buscar libros:", error);
      }
    },
    async createBook(data) {
      this.errors = [];
      try {
        const response = await axios.post("/api/books", data);
        this.books.push(response.data);
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al crear el libro:", error);
        }
      }
    },
    async updateBook(id, data) {
      this.errors = [];
      try {
        const response = await axios.put(`/api/books/${id}`, data);
        this.book = response.data;
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al actualizar el libro:", error);
        }
      }
    },
    async deleteBook(id) {
      try {
        await axios.delete(`/api/books/${id}`);
        this.books = this.books.filter((book) => book.id !== id);
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
      }
    },
  },
});
