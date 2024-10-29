// src/stores/userStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const isAuthenticated = ref(!!user.value);

  function setUser(userData) {
    user.value = userData;
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем пользователя в localStorage
  }

  function clearUser() {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user'); // Удаляем пользователя из localStorage
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser
  };
});
