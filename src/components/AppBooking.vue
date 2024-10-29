<template>
  <div class="booking">
    <h2>Онлайн-запись на курсы</h2>
    <form @submit.prevent="handleBooking">
      <select v-model="selectedCourse">
        <option disabled value="">Выберите курс</option>
        <option v-for="(course, key) in courses" :key="key" :value="key">{{ course }}</option>
      </select>

      <input type="date" v-model="startDate" required />
      <button type="submit">Записаться на курс</button>
    </form>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from "@/main.js";

export default {
  data() {
    return {
      selectedCourse: '',
      startDate: '',
      successMessage: '',
      courses: {
        1: 'Категория В',
        2: 'Категория С'
      },
      currentUserId: null, // Изначально null
    };
  },

  mounted() {
    // Получаем текущего пользователя из Firebase Authentication
    const userAuth = getAuth();
    const user = userAuth.currentUser;

    if (user) {
      this.currentUserId = user.uid; // Получаем uid из объекта user
      console.log('Текущий ID пользователя:', this.currentUserId);
    } else {
      console.error('Пользователь не аутентифицирован.');
    }
  },

  methods: {
    handleBooking() {
      if (!this.selectedCourse || !this.startDate) {
        alert('Пожалуйста, выберите курс и дату.');
        return;
      }

      const bookingData = {
        userId: this.currentUserId,
        course: this.courses[this.selectedCourse],
        startDate: this.startDate,
      };

      // Получаем ссылку на базу данных
      const firebaseRef = ref(database, 'booking/' + Date.now());

      // Записываем данные в Firebase
      set(firebaseRef, bookingData)
        .then(() => {
          this.successMessage = `Вы успешно записаны на курс "${bookingData.course}" с датой начала ${bookingData.startDate}.`;
          // Сбрасываем форму после успешной записи
          this.selectedCourse = '';
          console.log(bookingData.userId);
          this.startDate = '';

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        })
        .catch((error) => {
          console.error('Ошибка записи в Firebase:', error);
        });
    },
  }
};
</script>

<style scoped>
.booking {
  max-width: 400px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
}
select, input {
  margin-bottom: .5rem;
}
button {
  margin-top: .5rem;
}
.success-message {
  margin-top: 1rem;
  color: green;
}
</style>
