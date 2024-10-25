<template>
  <div class="booking">
    <h2>Онлайн-запись на курсы</h2>
    <form @submit.prevent="handleBooking">
      <select v-model="selectedCourse">
        <option disabled value="">Выберите курс</option>
        <option v-for="course in courses" :key="course.id">{{ course.title }}</option>
      </select>

      <input type="date" v-model="startDate" required />

      <button type="submit">Записаться на курс</button>
    </form>

    <div v-if="isBooked">
      <h3>Оплата курса:</h3>
      <button @click="handlePayment">Оплатить курс</button>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database';

export default {
  data() {
    return {
      selectedCourse: '',
      startDate: '',
      isBooked: false,
      courses: [],
    };
  },
  created() {
    const db = getDatabase();
    const coursesRef = ref(db, 'courses/');
    onValue(coursesRef, (snapshot) => {
      this.courses = snapshot.val() || [];
    });
  },
  methods: {
    handleBooking() {
      if (!this.selectedCourse || !this.startDate) {
        alert('Пожалуйста, выберите курс и дату.');
        return;
      }

      this.isBooked = true;
      alert(`Вы записаны на курс ${this.selectedCourse} с датой начала ${this.startDate}`);
    },
    handlePayment() {
      alert('Оплата прошла успешно!');
    }
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
.booking h3 {
  margin-top: .5rem;
}
</style>
