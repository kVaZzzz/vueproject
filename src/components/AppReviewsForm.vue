<template>
  <section>
    <form class="review-form" @submit.prevent="onSubmit">
      <h3>Отзывы</h3>
      <p>
        <label for="name">Имя</label>
        <input id="name" v-model="formData.name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="formData.review" placeholder="Ваш комментарий"></textarea>
      </p>
      <div>
        <label for="rating">Rating:</label>
        <select id="rating" v-model="formData.rating">
          <option value="1">Плохо</option>
          <option value="2">Нормально</option>
          <option value="3">Отлично</option>
        </select>
      </div>
      <p>
        <input class="button" type="submit" value="Send">
      </p>
    </form>
  </section>
</template>
<script>
import {getDatabase,set,ref, get,push} from "firebase/database";
import {database} from "@/main.js";

export default {
  data() {
    return {
      id: '',
      formData :{
        name: '',
        review: '',
        rating:1,
      },
    }
  },
  methods: {
    onSubmit() {
      if (this.formData.name || this.formData.review) {
        let db = database
        const Review = ref(db, "review")
        const newReview = push(Review)
        set(newReview, {
          name: this.formData.name,
          review: this.formData.review,
          rating: this.formData.rating,
        }).then(() => {
          const key = newReview.key
          this.key = key;
          console.log(this.key)
          console.log('qwe')
        }).catch((error) => {
          console.error(error);
        });
      } else {

      }
    }
  }
}
</script>
