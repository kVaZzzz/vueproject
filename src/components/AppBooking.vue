<template>
  <div class="booking">
    <h2>Онлайн-запись на курсы</h2>
    <form @submit.prevent="handleBooking">
      <select v-model="selectedCourse" required>
        <option disabled value="">Выберите курс</option>
        <option v-for="(course, key) in courses" :key="key" :value="key">{{ course }}</option>
      </select>

      <input type="date" v-model="startDate" required />
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

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
      errorMessage: '',
      courses: {
        1: 'Категория В',
        2: 'Категория С'
      },
      currentUserId: null,
    };
  },

  mounted() {
    const userAuth = getAuth();
    const user = userAuth.currentUser;

    if (user) {
      this.currentUserId = user.uid;
      console.log('Текущий ID пользователя:', this.currentUserId);
    } else {
      console.error('Пользователь не аутентифицирован.');
    }
  },

  methods: {
    handleBooking() {
      this.errorMessage = '';

      if (!this.selectedCourse || !this.startDate) {
        this.errorMessage = 'Пожалуйста, выберите курс и дату.';
        return;
      }

      const selectedDate = new Date(this.startDate);
      const currentDate = new Date();

      if (selectedDate <= currentDate) {
        this.errorMessage = 'Дата начала должна быть в будущем.';
        return;
      }

      const bookingData = {
        userId: this.currentUserId,
        course: this.courses[this.selectedCourse],
        startDate: this.startDate,
      };

      const firebaseRef = ref(database, 'booking/' + Date.now());

      set(firebaseRef, bookingData)
        .then(() => {
          this.successMessage = `Вы успешно записаны на курс "${bookingData.course}" с датой начала ${bookingData.startDate}.`;
          this.selectedCourse = '';
          this.startDate = '';

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        })
        .catch((error) => {
          console.error('Ошибка записи в Firebase:', error);
          this.errorMessage = 'Произошла ошибка при записи. Пожалуйста, попробуйте еще раз.';
        });
    },
  }
};
</script>

<style scoped>
.booking {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.booking h2 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.booking form {
  display: flex;
  flex-direction: column;
}

.booking select,
.booking input[type="date"],
.booking button {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.booking select:focus,
.booking input[type="date"]:focus {
  border-color: #007bff;
  outline: none;
}

.booking button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.booking button:hover {
  background-color: #0056b3;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: small;
  margin-top: -10px;
}
</style>
