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
  resize: vertical; /* Позволяет изменять размер только по вертикали */
}

.review-form .button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.review-form .button:hover {
  background-color: #0056b3; /* Эффект наведения */
}
</style>
