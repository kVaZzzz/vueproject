<template>
  <div class="courses">
    <h2>Информация о курсах</h2>
    <div v-for="course in courses" :key="course.id" class="course">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <p><strong>Стоимость:</strong> {{ course.price }} руб.</p>
      <p><strong>Продолжительность:</strong> {{ course.duration }} часов.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const courses = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/courses`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    courses.value = data.documents.map(doc => doc.fields);
  } catch (error) {
    console.error('Ошибка при получении данных о курсах:', error);
  }
});
</script>

<style scoped>
.courses {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.courses h2 {
  font-size: 28px;
  text-align: center;
}

.course {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.course h3 {
  font-size: 24px;
}

.course p {
  font-size: 16px;
}

/* Адаптивные стили */
@media (max-width: 600px) {
  .courses {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .courses h2 {
    font-size: 24px;
  }

  .course h3 {
    font-size: 20px;
  }

  .course p {
    font-size: 14px;
  }
}
</style>
