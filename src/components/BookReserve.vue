<template>
  <section class="bg-[#F4F7FF] py-20 lg:py-[120px]">
    <!-- <h1 v-if="user" class="text-3xl font-bold mb-6">Welcome, {{ user.name }}</h1> -->
      <ReservationList v-if="book" :book="book"  :key="book.id"/>
  </section>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import ReservationList from "./ReservationList.vue";
import { useBookStore } from "../stores/books";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default defineComponent({
  components: { ReservationList },
  setup() {
    const route = useRoute();
    const id = ref(route.params.id);
    const bookStore = useBookStore();
    const book = ref(null);
    const authStore = useAuthStore();
    const user = ref(null);

    onMounted(async () => {
      user.value = await authStore.getUser(); // Ensure user data is fetched
      book.value = await bookStore.fetchBook(id.value);
    });

    return {
      user,
      book,
    };
  },
});
</script>
