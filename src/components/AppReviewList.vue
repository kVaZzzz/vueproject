<template>
  <section class="review-list">
    <ul>
      <li v-for="(review, index) in reviews" :key="index">
        <strong>{{ review.name }}</strong>
        <p>{{ review.review }}</p>
        <p>{{ review.rating}}</p>
      </li>
    </ul>
  </section>
</template>

<script>
import {getDatabase,set,ref, get,push,update } from "firebase/database";
import {database} from "@/main.js";
export default {

  data() {
    return {
      reviews:[],
    }
  },
  mounted() {
    this.loadReviews();
  },
  methods: {
    loadReviews() {
      const reviewRef = ref(database, 'review');
      get(reviewRef).then(snapshot => {
        if (snapshot.exists()) {
          this.reviews = [];
          snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            data.id = childSnapshot.key; // Добавляем уникальный идентификатор
            this.reviews.push(data);
          });
        } else {
          console.log("Данные не найдены");
        }
      }).catch(error => {
        console.error("Ошибка при получении данных из базы данных:", error);
      });
    },
  }
};
</script>
