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

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const isAuth = computed(() => userStore.isAuthenticated);

onMounted(() => {
  userStore.checkAuthState();
});

const logout = async () => {
  userStore.logout();
  router.push('/auth');
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
}

header {
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(32,5,45,1) 98%, rgba(0,212,255,1) 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
}

header h1 {
  text-align: center;
  margin-bottom: 15px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  margin-top: 6px;
}

nav a:hover {
  text-decoration: underline;
}

nav form {
  margin-left: 20px;
}

nav button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
}

nav button:hover {
  background-color: #c82333;
}

.intro {
  text-align: center;
  margin-top: 40px;
}

.intro h2 {
  font-size: 26px;
}

.intro p {
  font-size: 18px;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    align-items: center;
  }
  nav form {
    margin-left: 0px;
  }
  nav a,
  nav button {
    margin: 10px 0;
  }

  .intro h2 {
    font-size: 22px;
  }

  .intro p {
    font-size: 16px;
  }
}
</style>
