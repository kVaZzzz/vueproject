<template>
  <section>
    <form class="review-form" @submit.prevent="onSubmit">
      <h3>Отзывы</h3>
      <p>
        <label for="name">Имя</label>
        <input id="name" v-model="formData.name" placeholder="Ваше имя" required>
      <p v-if="errorName" class="error">{{ errorName }}</p>
      </p>
      <p>
        <label for="review">Отзыв:</label>
        <textarea id="review" v-model="formData.review" placeholder="Ваш комментарий" required></textarea>
      <p v-if="errorReview" class="error">{{ errorReview }}</p>
      </p>
      <div>
        <label for="rating">Оценка:</label>
        <select id="rating" v-model="formData.rating">
          <option value="1">Плохо</option>
          <option value="2">Нормально</option>
          <option value="3">Отлично</option>
        </select>
      </div>
      <p>
        <input class="button" type="submit" value="Отправить">
      </p>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const formData = ref({
  name: '',
  review: '',
  rating: 1,
});
const errorName = ref('');
const errorReview = ref('');
const successMessage = ref('');
const userStore = useUserStore();

const onSubmit = async () => {
  errorName.value = '';
  errorReview.value = '';
  successMessage.value = '';

  if (!formData.value.name) {
    errorName.value = 'Пожалуйста, введите ваше имя.';
    return;
  }

  if (!formData.value.review) {
    errorReview.value = 'Пожалуйста, напишите ваш отзыв.';
    return;
  }

  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/reviews?documentId=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          name: { stringValue: formData.value.name },
          review: { stringValue: formData.value.review },
          rating: { integerValue: formData.value.rating },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    successMessage.value = 'Ваш отзыв успешно отправлен!';
    formData.value.name = '';
    formData.value.review = '';
    formData.value.rating = 1;

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error);
    errorReview.value = 'Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.';
  }
};
</script>

<style scoped>
.review-form {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.review-form h3 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.review-form p {
  margin-bottom: 15px;
}

.review-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.review-form input[type="text"],
.review-form textarea,
.review-form select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.review-form input[type="text"]:focus,
.review-form textarea:focus,
.review-form select:focus {
  border-color: #007bff;
  outline: none;
}

.review-form textarea {
  resize: vertical;
}

.review-form .button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.review-form .button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: small;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

@media (max-width: 600px) {

  .review-form h3 {
    font-size: 24px;
  }

  .review-form input[type="text"],
  .review-form textarea,
  .review-form select,
  .review-form .button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
