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

.registration {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.invalid {
  color: var(--color-error);
}

p {
  padding: 5px;
  font-weight: bolder;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 20px;
  border: #e0e0e0 2px solid;
  width: fit-content;
  padding: 30px;
  height: fit-content;
}

input {
  border-radius: 20px;
  border: var( --color-border);
  padding: 20px;
}

</style>
