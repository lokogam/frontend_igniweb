import { defineStore } from "pinia";
import axios from "axios";

export const useCategoryStore = defineStore("categories", {
  state: () => ({
    categories: [],
    category: null,
    errors: [],
  }),
  actions: {
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    },
    async fetchCategory(id) {
      try {
        const response = await axios.get(`/api/categories/${id}`);
        this.category = response.data;
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
      }
    },
    async createCategory(data) {
      this.errors = [];
      try {
        const response = await axios.post("/api/categories", data);
        this.categories.push(response.data);
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al crear la categoría:", error);
        }
      }
    },
    async updateCategory(id, data) {
      this.errors = [];
      try {
        const response = await axios.put(`/api/categories/${id}`, data);
        this.category = response.data;
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al actualizar la categoría:", error);
        }
      }
    },
    async deleteCategory(id) {
      try {
        await axios.delete(`/api/categories/${id}`);
        this.categories = this.categories.filter(category => category.id !== id);
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    },
  },
});
