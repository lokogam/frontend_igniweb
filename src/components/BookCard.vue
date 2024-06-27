<template>
  <div class="bg-white p-4 rounded shadow-md">
    <img :src="book.image" alt="Book Image" class="w-full h-48 object-cover mb-4">
    <h2 class="text-xl font-bold mb-2">{{ book.title }}</h2>
    <p class="text-gray-700 mb-2">{{ book.author }}</p>
    <p class="text-gray-700 mb-2">Category: {{ book.category.name }}</p>
    <p class="text-gray-700 mb-4">{{ book.description }}</p>
    
    <!-- Mostra il link di prenotazione solo se il libro è prenotabile -->
    <router-link v-if="isBookReservable" :to="{ name: 'BookReserve', params: { id: book.id } }" class="bg-blue-500 text-white px-4 py-2 rounded">Reserve</router-link>
    <p v-else-if="!isBookReservable && book.reservations && book.reservations.status === 'Active'" class="text-gray-500">Non disponibile per la prenotazione al momento.</p>
    <p v-else class="text-gray-500">Non disponibile per la prenotazione.</p>
  </div>
</template>

<script>
export default {
  props: {
    book: Object
  },
  computed: {
    isBookReservable() {
      // Verifica se il libro è prenotabile (reservations è nullo o status è 'Not Active')
      return !this.book.reservations || this.book.reservations.status === 'Not Active';
    }
  }
}
</script>
