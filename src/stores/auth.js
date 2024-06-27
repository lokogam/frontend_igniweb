import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    authErrors: [],
    authStatus: null,
  }),
  getters: {
    user: (state) => state.authUser,
    errors: (state) => state.authErrors,
    status: (state) => state.authStatus,
  },
  actions: {
    async getToken() {
      try {
        await axios.get("/sanctum/csrf-cookie");
      } catch (error) {
        console.error("Error al obtener el token CSRF:", error);
      }
    },
    async getUser() {
      try {
        await this.getToken();
        const data = await axios.get("/api/user");
        this.authUser = data.data;
        return this.authUser;
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    },
    async handleLogin(data) {
      this.authErrors = [];
      try {
        await this.getToken();
        await axios.post("/login", {
          email: data.email,
          password: data.password,
        });
        this.router.push("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.authErrors = error.response.data.errors;
          } else {
            console.error('Error en el login:', error.response.data);
          }
        } else {
          console.error('Error en el login:', error.message);
        }
      }
    },
    async handleRegister(data) {
      this.authErrors = [];
      await this.getToken();
      try {
        await axios.post("/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });
        this.router.push("/");
      } catch (error) {
        if (error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleLogout() {
      await axios.post("/logout");
      this.authUser = null;
    },
    async handleForgotPassword(email) {
      this.authErrors = [];
      this.getToken();
      try {
        const response = await axios.post("/forgot-password", {
          email: email,
        });
        this.authStatus = response.data.status;
      } catch (error) {
        if (error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleResetPassword(resetData) {
      this.authErrors = [];
      try {
        const response = await axios.post("/reset-password", resetData);
        this.authStatus = response.data.status;
      } catch (error) {
        if (error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
  },
});
