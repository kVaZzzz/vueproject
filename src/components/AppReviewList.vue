<template>
  <section class="review-list">
    <ul>
      <li v-for="(review, index) in reviews" :key="index">
        <strong>{{ review.name }}</strong>
        <p>{{ review.review }}</p>
        <p>Рейтинг: {{ review.rating }}</p>
        <p>Лайки: {{ review.likes || 0 }}</p>
        <button v-if="isAuthenticated" @click="toggleLike(review.id)" :class="{ liked: isLiked(review.id) }">
          {{ isLiked(review.id) ? 'Убрать лайк' : 'Лайк' }}
        </button>
        <p v-else>Чтобы поставить лайк, пожалуйста, войдите в систему.</p>
      </li>
    </ul>
  </section>
</template>
<script>
import { getDatabase, ref, get, update, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/main.js";

export default {
  data() {
    return {
      reviews: [],
      userId: null,
      userLikes: new Set(),
      isAuthenticated: false,
    };
  },
  mounted() {
    this.loadReviews();
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid;
          this.isAuthenticated = true;
          this.loadUserLikes();
        } else {
          this.isAuthenticated = false;
        }
      });
    },
    loadReviews() {
      const reviewRef = ref(database, 'review');
      get(reviewRef).then(snapshot => {
        if (snapshot.exists()) {
          this.reviews = [];
          snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            data.id = childSnapshot.key;
            this.reviews.push(data);
          });
        } else {
          console.log("Данные не найдены");
        }
      }).catch(error => {
        console.error("Ошибка при получении данных из базы данных:", error);
      });
    },
    loadUserLikes() {
      const userLikesRef = ref(database, `userLikes/${this.userId}`);
      get(userLikesRef).then(snapshot => {
        if (snapshot.exists()) {
          this.userLikes = new Set(snapshot.val().likes || []);
        }
      }).catch(error => {
        console.error("Ошибка при получении лайков пользователя:", error);
      });
    },
    toggleLike(reviewId) {
      const reviewRef = ref(database, `review/${reviewId}`);
      const userLikesRef = ref(database, `userLikes/${this.userId}`);
      if (this.userLikes.has(reviewId)) {
        update(reviewRef, { likes: (this.reviews.find(review => review.id === reviewId).likes || 0) - 1 });
        this.userLikes.delete(reviewId);
      } else {
        update(reviewRef, { likes: (this.reviews.find(review => review.id === reviewId).likes || 0) + 1 });
        this.userLikes.add(reviewId);
      }
      set(userLikesRef, { likes: Array.from(this.userLikes) });

      // Обновляем локальное состояние
      const currentLikes = this.reviews.find(review => review.id === reviewId).likes || 0;
      this.reviews.find(review => review.id === reviewId).likes = this.userLikes.has(reviewId) ? currentLikes + 1 : currentLikes - 1;
    },
    isLiked(reviewId) {
      return this.userLikes.has(reviewId);
    },
  },
};
</script>

<style scoped>
.review-list {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.review-list ul {
  list-style-type: none;
  padding-left: 0;
}

.review-list li {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-list strong {
  font-size: 18px;
  color: #333;
}

.review-list p {
  margin: 5px 0;
}

.review-list button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.review-list button:hover {
  background-color: #0056b3;
}

.review-list .liked {
  background-color: #28a745;
}

@media (max-width: 600px) {
  .review-list {
    padding: 15px;
  }

  .review-list strong {
    font-size: 16px;
  }

  .review-list p {
    font-size: 14px;
  }

  .review-list button {
    padding: 6px;
    font-size: 14px;
  }
}
</style>
