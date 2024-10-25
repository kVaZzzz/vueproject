import { defineStore } from 'pinia'
import {computed, ref} from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const isAuth = ref(!!user.value)

  return {
    user,
    isAuth
  }
})
