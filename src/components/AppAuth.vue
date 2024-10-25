<template>
  <div class="auth">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" v-model="formData.email" placeholder="Email" required />
      <input type="password" v-model="formData.password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <router-link to="/reg">Зарегистрироваться</router-link>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import {apps} from "@/main.js";
import router from "@/router/index.js";

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    handleSubmit() {
      const userAuth = getAuth(apps)
      signInWithEmailAndPassword(userAuth, this.formData.email, this.formData.password).then((res) => {
        const userData = res.user;
        localStorage.setItem('user', JSON.stringify(userData));
        this.user = userData;
        this.isAuth = true
        router.push('/');
      }).catch((error) => {
        this.errorUser = error.message
      })
    },
  }
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
