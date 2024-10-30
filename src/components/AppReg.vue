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
      <input
        type="password"
        name="password"
        placeholder="password"
        v-model="formData.password"
        required
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  </section>
</template>

<script>
import {apps} from "../main.js";
import {getAuth, createUserWithEmailAndPassword,fetchSignInMethodsForEmail} from "firebase/auth";
import {storeToRefs} from "pinia";
import {useUserStore} from "../stores/counter.js";
import router from "@/router/index.js";

export default {

  data () {
    return {
      errorUser:'',
      errorEmail:"",
      errors: [],
      formData: {
        email:'',
        password:'',
      },
    }
  },
  setup() {
    const userStore = storeToRefs(useUserStore())
    const { user } = userStore

    return {
      user
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const userAuth = getAuth(apps)
        const userCredential = await createUserWithEmailAndPassword(userAuth, this.formData.email, this.formData.password);
        const userData = userCredential.user;
        localStorage.setItem('userUID', userData.uid);
        this.user = userData;
        console.log(userData)
        router.push('/auth');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.errorEmail = ''
          this.errorUser = error
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorMessage,errorCode);
      }
    },
  }
}

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

.wrap.registration p {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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
  cursor: pointer;
}

.wrap.registration button:hover {
  background-color: #0056b3;
}
</style>
