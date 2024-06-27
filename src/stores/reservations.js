import { defineStore } from "pinia";
import axios from "axios";

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    reservations: [],
    reservation: null,
    errors: [],
  }),
  actions: {
    async fetchReservations() {
      try {
        const response = await axios.get("/api/reservations");
        this.reservations = response.data;
        console.log('data',this.reservations);
        return this.reservations;
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      }
    },
    async fetchReservation(id) {
      try {
        const response = await axios.get(`/api/reservations/${id}`);
        this.reservation = response.data;
      } catch (error) {
        console.error("Error al obtener la reserva:", error);
      }
    },
    async createReservation(data) {
      this.errors = [];
      try {
        const response = await axios.post("/api/reservations", data);
        this.reservations.push(response.data);
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al crear la reserva:", error);
        }
      }
    },
    async updateReservation(id, data) {
      this.errors = [];
      try {
        const response = await axios.put(`/api/reservations/${id}`, data);
        this.reservation = response.data;
      } catch (error) {
        if (error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          console.error("Error al actualizar la reserva:", error);
        }
      }
    },
    async deleteReservation(id) {
      try {
        await axios.delete(`/api/reservations/${id}`);
        this.reservations = this.reservations.filter(reservation => reservation.id !== id);
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
      }
    },
  },
});
