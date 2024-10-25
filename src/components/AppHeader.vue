<template>
  <div class="home">
    <header>
      <h1>Добро пожаловать в Автошколу</h1>
      <nav>
        <router-link to="/auth"  v-if="!isAuth">Авторизация</router-link>
        <router-link to="/courses">Курсы</router-link>
        <router-link to="/booking">Запись на курсы</router-link>
        <router-link to="/dashboard">Личный кабинет</router-link>
        <router-link to="/reviews">Отзывы</router-link>
        <router-link to="/contact">Контакты</router-link>
        <router-link to="/news">Новости</router-link>
        <form @submit.prevent="logout">
          <button type="submit" v-if="isAuth">
            Выйти
          </button>
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
import {getAuth, signOut} from "firebase/auth";
import {storeToRefs} from "pinia/dist/pinia";
import {useUserStore} from "@/stores/counter.js";
import router from "@/router/index.js";
export default {

  setup() {
    const userStore = storeToRefs(useUserStore())
    const { isAuth } = userStore

    return {
      isAuth,
    }
  },
  methods: {
    logout() {
      const user = getAuth();
      if (this.isAuth) {
        signOut(user)
          .then(() => {
            localStorage.removeItem('user');
            this.isAuth = false;
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else {
        console.log('Пользователь был не авторизован');
      }
    }
  }
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
