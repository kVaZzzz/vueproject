<template>
  <section class="wrap registration">
    <p>Регистрация</p>
    <form @submit.prevent="handleSubmit">
      <input
        type="email"
        name="email"
        placeholder="Email"
        v-model="formData.email"
        required
      />
      <p v-if="errorEmail" class="error">{{ errorEmail }}</p>
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        v-model="formData.password"
        required
      />
      <p v-if="errorPassword" class="error">{{ errorPassword }}</p>
      <button type="submit">Зарегистрироваться</button>
    </form>
    <p v-if="errorUser" class="error">{{ errorUser }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const errorUser = ref('');
const errorEmail = ref('');
const errorPassword = ref('');
const formData = ref({
  email: '',
  password: '',
});
const router = useRouter();
const userStore = useUserStore();

const validateEmail = (email) => {
  const re = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
  return re.test(email);
};

const handleSubmit = async () => {
  errorEmail.value = '';
  errorPassword.value = '';

  if (!validateEmail(formData.value.email)) {
    errorEmail.value = 'Введите корректный email. Пример: user@example.com';
    return;
  }

  if (formData.value.password.length < 6) {
    errorPassword.value = 'Пароль должен содержать минимум 6 символов.';
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB9Cx6vMAu9DgAY4Ey2R199ZEc-IjXeQGM`, {
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
    router.push('/auth');
  } catch (error) {
    if (error.message.includes('EMAIL_EXISTS')) {
      errorEmail.value = 'Этот email уже зарегистрирован.';
      errorUser.value = '';
    } else {
      errorUser.value = error.message;
      console.error('Ошибка:', error.message);
    }
  }
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
