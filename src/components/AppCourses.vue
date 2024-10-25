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
  margin:auto;
}
.course {
  border-bottom:1px solid #ccc;
  padding-bottom:10px;
}
</style>
