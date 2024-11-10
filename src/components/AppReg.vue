<template>
  <section class="wrap registration">
    <p>Регистрация</p>
    <form @submit.prevent="handleSubmit">
      <input
        type="email"
        name="email"
        placeholder="email"
        v-model="formData.email"
        required
      />
      <p v-if="errorEmail" class="error">{{ errorEmail }}</p>
      <input
        type="password"
        name="password"
        placeholder="password"
        v-model="formData.password"
        required
      />
      <p v-if="errorPassword" class="error">{{ errorPassword }}</p>
      <button type="submit">Зарегистрироваться</button>
    </form>
  </section>
</template>

<script>
import { apps } from "../main.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/counter.js";
import router from "@/router/index.js";

export default {
  data() {
    return {
      errorUser: '',
      errorEmail: '',
      errorPassword: '',
      formData: {
        email: '',
        password: '',
      },
    };
  },
  setup() {
    const userStore = storeToRefs(useUserStore());
    const { user } = userStore;

    return {
      user,
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return re.test(email);
    },
    async handleSubmit() {
      this.errorEmail = '';
      this.errorPassword = '';

      if (!this.validateEmail(this.formData.email)) {
        this.errorEmail = 'Введите корректный email. Пример: user@example.com';
        return;
      }

      if (this.formData.password.length < 6) {
        this.errorPassword = 'Пароль должен содержать минимум 6 символов.';
        return;
      }

      try {
        const userAuth = getAuth(apps);
        const userCredential = await createUserWithEmailAndPassword(userAuth, this.formData.email, this.formData.password);
        const userData = userCredential.user;
        localStorage.setItem('userUID', userData.uid);
        this.user = userData;
        console.log(userData);
        router.push('/auth');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.errorEmail = 'Этот email уже зарегистрирован.';
          this.errorUser = '';
        } else {
          this.errorUser = error.message; // Обработка других ошибок
          console.error('Error:', error.message, error.code);
        }
      }
    },
  },
};
</script>

<style scoped>
.wrap.registration {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.wrap.registration form {
  display: flex;
  flex-direction: column;
}

.wrap.registration input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.wrap.registration input:focus {
  border-color: #007bff;
  outline: none;
}

.wrap.registration button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.wrap.registration button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: small;
}

@media (max-width: 600px) {
  .wrap.registration {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .wrap.registration input,
  .wrap.registration button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
