<template>
  <div class="auth">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" v-model="formData.email" placeholder="Email" required />
      <p v-if="emailError" class="error">{{ emailError }}</p>
      <input type="password" v-model="formData.password" placeholder="Пароль" required />
      <p v-if="passwordError" class="error">{{ passwordError }}</p>
      <button type="submit">Войти</button>
      <button type="button"><router-link class="reg" to="/reg">Зарегистрироваться</router-link></button>
    </form>
    <p v-if="errorUser">{{ errorUser }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const formData = ref({
  email: '',
  password: '',
});
const errorUser = ref('');
const emailError = ref('');
const passwordError = ref('');
const router = useRouter();
const userStore = useUserStore();

const validateEmail = (email) => {
  const re = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
  return re.test(email);
};

const handleSubmit = async () => {
  emailError.value = '';
  passwordError.value = '';

  if (!validateEmail(formData.value.email)) {
    emailError.value = 'Введите корректный email.';
    return;
  }

  if (formData.value.password.length < 6) {
    passwordError.value = 'Пароль должен содержать минимум 6 символов.';
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB9Cx6vMAu9DgAY4Ey2R199ZEc-IjXeQGM`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password,
        returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    userStore.setUser(data);
    router.push('/dashboard');
  } catch (error) {
    if (error.message.includes('EMAIL_NOT_FOUND')) {
      emailError.value = 'Пользователь с таким email не найден.';
      errorUser.value = '';
    } else if (error.message.includes('INVALID_PASSWORD')) {
      passwordError.value = 'Неверный пароль.';
      errorUser.value = '';
    } else {
      errorUser.value = 'Ошибка при авторизации: ' + error.message;
      console.error('Ошибка:', error.message);
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: small;
}

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

.reg {
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
}

.auth a {
  display: block;
  text-align: center;
}

@media (max-width: 600px) {
  .auth {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .auth h2 {
    font-size: 20px;
  }

  .auth input,
  .auth button {
    font-size: 14px;
    padding: 8px;
  }

  .auth button {
    margin-bottom: 10px;
  }
}
</style>
