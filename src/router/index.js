import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import { useAuthStore } from "../stores/auth"; // Importa el store de autenticación

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../components/ForgotPassword.vue"),
  },
  {
    path: "/password-reset/:token",
    name: "ResetPassword",
    component: () => import("../components/ResetPassword.vue"),
  },
  {
    path: "/books/:id/reserve",
    name: "BookReserve",
    component: () => import("../components/BookReserve.vue"),
    meta: { requiresAuth: true }, // Indica que requiere autenticación
  },
  {
    path: "/user-reserved-books",
    name: "UserReservedBooks",
    component: () => import("../components/UserReservedBooks.vue"),
    meta: { requiresAuth: true }, // Indica que requiere autenticación
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Agrega el guard de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore(); // Accede al store de autenticación

  // Verifica si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Si no hay usuario autenticado, intenta obtenerlo
    if (!authStore.authUser) {
      try {
        await authStore.getUser(); // Intenta obtener el usuario autenticado
      } catch (error) {
        console.error("Error al intentar autenticar al usuario:", error);
      }
    }

    // Si el usuario no está autenticado, redirige a la página de login
    if (!authStore.authUser) {
      next({ name: "Login" });
    } else {
      next(); // Si está autenticado, permite el acceso a la ruta
    }
  } else {
    next(); // Si la ruta no requiere autenticación, permite el acceso
  }
});

export default router;
