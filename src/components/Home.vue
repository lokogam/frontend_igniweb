<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import BookList from "./BookList.vue";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.getUser();
});

</script>
<template>
  <div class="max-w-7xl mx-auto">
    <div >
      <div v-if="authStore.user">
        <!-- <h1>{{ authStore.user.name }}</h1>
        <p>{{ authStore.user.email }}</p> -->
        <BookList/>
    </div>
    <div v-else>
      <h1>Go and login</h1>
    </div>

    </div>
  </div>
</template>