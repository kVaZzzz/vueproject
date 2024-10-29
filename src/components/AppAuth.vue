<template>
  <div class="auth">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" v-model="formData.email" placeholder="Email" required />
      <input type="password" v-model="formData.password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <router-link to="/reg">Зарегистрироваться</router-link>
    </form>
    <p v-if="errorUser">{{ errorUser }}</p>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { apps } from "@/main.js";
import { useUserStore } from "@/stores/counter.js"; // Импортируем хранилище
import router from "@/router/index.js";

export default {
  setup() {
    const userStore = useUserStore(); // Инициализируем хранилище
    const formData = reactive({
      email: '',
      password: '',
    });
    const errorUser = ref('');

    const handleSubmit = () => {
      const userAuth = getAuth(apps);
      signInWithEmailAndPassword(userAuth, formData.email, formData.password)
        .then((res) => {
          const userData = res.user;
          localStorage.setItem('user', JSON.stringify(userData));
          userStore.setUser(userData); // Устанавливаем пользователя в хранилище
          router.push('/dashboard'); // Перенаправление на личный кабинет
        })
        .catch((error) => {
          errorUser.value = error.message; // Обработка ошибок
        });
    };

    return { formData, errorUser, handleSubmit };
  },
};
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
}
input {
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
}
</style>
