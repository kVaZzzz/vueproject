<template>
  <section class="review-list">
    <ul>
      <li v-for="(review, index) in reviews" :key="index">
        <strong>{{ review.name?.stringValue || 'Без имени' }}</strong>
        <p>{{ review.review?.stringValue || 'Без отзыва' }}</p>
        <p>Рейтинг: {{ review.rating?.integerValue || 0 }}</p>
        <p>Лайки: {{ review.likes?.integerValue || 0 }}</p>
        <button v-if="isAuthenticated" @click="toggleLike(review.id)" :class="{ liked: isLiked(review.id) }">
          {{ isLiked(review.id) ? 'Убрать лайк' : 'Лайк' }}
        </button>
        <p v-else>Чтобы поставить лайк, пожалуйста, войдите в систему.</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const reviews = ref([]);
const userLikes = ref(new Set());
const isAuthenticated = ref(false);
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await loadReviews();
  await checkAuthentication();
});

const loadReviews = async () => {
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/reviews`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    if (data.documents) {
      reviews.value = data.documents.map(doc => ({ id: doc.name.split('/').pop(), ...doc.fields }));
    } else {
      reviews.value = [];
    }
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error);
  }
};

const checkAuthentication = async () => {
  isAuthenticated.value = userStore.isAuthenticated;
  if (isAuthenticated.value) {
    await loadUserLikes();
  }
};

const loadUserLikes = async () => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/userLikes/${userStore.user?.localId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Если документ не найден, создаем его
        await createUserLikesDocument();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
    } else {
      const data = await response.json();
      if (data.fields && data.fields.likes && data.fields.likes.arrayValue && data.fields.likes.arrayValue.values) {
        userLikes.value = new Set(data.fields.likes.arrayValue.values.map(value => value.stringValue));
      }
    }
  } catch (error) {
    console.error('Ошибка при получении лайков пользователя:', error);
  }
};

const createUserLikesDocument = async () => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/userLikes/${userStore.user?.localId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          likes: { arrayValue: { values: [] } },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }
  } catch (error) {
    console.error('Ошибка при создании документа userLikes:', error);
  }
};

const toggleLike = async (reviewId) => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const reviewRef = `https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/reviews/${reviewId}`;
    const userLikesRef = `https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/userLikes/${userStore.user?.localId}`;

    const review = reviews.value.find(review => review.id === reviewId);
    const currentLikes = review.likes?.integerValue || 0;

    if (userLikes.value.has(reviewId)) {
      userLikes.value.delete(reviewId);
      await fetch(reviewRef, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.user?.idToken}`,
        },
        body: JSON.stringify({
          fields: {
            likes: { integerValue: currentLikes - 1 },
          },
        }),
      });
    } else {
      userLikes.value.add(reviewId);
      await fetch(reviewRef, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.user?.idToken}`,
        },
        body: JSON.stringify({
          fields: {
            likes: { integerValue: currentLikes + 1 },
          },
        }),
      });
    }

    await fetch(userLikesRef, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          likes: { arrayValue: { values: Array.from(userLikes.value).map(id => ({ stringValue: id })) } },
        },
      }),
    });

    // Обновляем локальное состояние
    review.likes = { integerValue: userLikes.value.has(reviewId) ? currentLikes + 1 : currentLikes - 1 };
  } catch (error) {
    console.error('Ошибка при обновлении лайков:', error);
  }
};

const isLiked = (reviewId) => {
  return userLikes.value.has(reviewId);
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
