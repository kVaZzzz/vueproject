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

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const selectedCourse = ref('');
const startDate = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const courses = ref({
  1: 'Категория В',
  2: 'Категория С'
});
const currentUserId = ref(null);
const userStore = useUserStore();

onMounted(() => {
  currentUserId.value = userStore.user?.localId;
});

const handleBooking = async () => {
  errorMessage.value = '';

  if (!selectedCourse.value || !startDate.value) {
    errorMessage.value = 'Пожалуйста, выберите курс и дату.';
    return;
  }

  const selectedDate = new Date(startDate.value);
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    errorMessage.value = 'Дата начала должна быть в будущем.';
    return;
  }

  const bookingData = {
    userId: currentUserId.value,
    course: courses.value[selectedCourse.value],
    startDate: startDate.value,
  };

  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/bookings?documentId=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          userId: { stringValue: bookingData.userId },
          course: { stringValue: bookingData.course },
          startDate: { stringValue: bookingData.startDate },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    successMessage.value = `Вы успешно записаны на курс "${bookingData.course}" с датой начала ${bookingData.startDate}.`;
    selectedCourse.value = '';
    startDate.value = '';

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error) {
    console.error('Ошибка записи в Firebase:', error);
    errorMessage.value = 'Произошла ошибка при записи. Пожалуйста, попробуйте еще раз.';
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

/* Адаптивные стили */
@media (max-width: 600px) {
  .booking {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .booking h2 {
    font-size: 24px;
  }

  .booking select,
  .booking input[type="date"],
  .booking button {
    font-size: 14px;
    padding: 8px;
  }

  .booking button {
    margin-bottom: 10px;
  }
}
</style>
