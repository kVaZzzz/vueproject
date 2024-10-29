<template>
  <div class="home">
    <header>
      <h1>Добро пожаловать в Автошколу</h1>
      <nav>
        <router-link to="/auth" v-if="!isAuth">Авторизация</router-link>
        <router-link to="/courses">Курсы</router-link>
        <router-link to="/booking" v-if="isAuth">Запись на занятия</router-link>
        <router-link to="/dashboard" v-if="isAuth">Личный кабинет</router-link>
        <router-link to="/reviews">Отзывы</router-link>
        <router-link to="/contact">Контакты</router-link>
        <router-link to="/news">Новости</router-link>

        <form @submit.prevent="logout">
          <button type="submit" v-if="isAuth">Выйти</button>
        </form>
      </nav>
    </header>

    <main>
      <section class="intro">
        <h2>Учитесь водить с нами!</h2>
        <p>Мы предлагаем разнообразные курсы обучения вождению.</p>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useUserStore } from "@/stores/userStore";

export default {
  setup() {
    const userStore = useUserStore();

    const isAuth = computed(() => userStore.isAuthenticated);

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userStore.setUser(user); // Устанавливаем пользователя
        } else {
          userStore.clearUser(); // Очищаем пользователя
        }
      });
    });

    const logout = async () => {
      const auth = getAuth();
      await signOut(auth);
      userStore.clearUser(); // Очищаем пользователя из хранилища
    };

    return { isAuth, logout };
  },
};
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 20px;
}
button{
  border: none;
  cursor: pointer;
}
router-link{
  text-decoration: none;
}
nav{
  display: flex;
  flex-direction: row;
  justify-content: center;
}
nav a {
  margin: 0 15px;
  text-decoration: none;
  color: black;
}
.intro {
  margin: 20px;
}
</style>
