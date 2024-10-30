<template>
  <div class="auth">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" v-model="formData.email" placeholder="Email" required />
      <input type="password" v-model="formData.password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <button type="submit"><router-link class="reg" to="/reg">Зарегистрироваться</router-link></button>
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
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.auth h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.auth form {
  display: flex;
  flex-direction: column;
}
.reg{
  color: white;
  text-decoration: none;
}
.auth input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.auth input:focus {
  border-color: #007bff;
  outline: none;
}

.auth button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}

.auth button:hover {
  background-color: #0056b3;
}

.auth p {
  text-align: center;
  color: red; /* Цвет для сообщения об ошибке */
}

.auth a {
  display: block;
  text-align: center;
}
</style>
