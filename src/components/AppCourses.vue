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

<script>
import { getDatabase, ref, onValue } from 'firebase/database';

export default {
  data() {
    return {
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
};
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
