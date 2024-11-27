<template>
  <div class="dashboard">
    <div class="change-password">
      <h2>Личный кабинет студента</h2>
      <h3>Изменить пароль</h3>
      <input type="password" v-model="newPassword" placeholder="Новый пароль" required />
      <button @click="changePassword">Сменить пароль</button>
      <p v-if="errorUser">{{ errorUser }}</p>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>

    <ul v-if="userCourses.length">
      <li v-for="(course, index) in userCourses" :key="index">
        {{ course.course.stringValue }} - Дата начала: {{ course.startDate.stringValue }}
      </li>
    </ul>
    <p v-else-if="noCoursesFound">Нет записанных курсов.</p>

    <div class="delete-account">
      <h3>Удалить аккаунт</h3>
      <button @click="deleteAccount">Удалить мой аккаунт</button>
      <p v-if="deleteError">{{ deleteError }}</p>
      <p v-if="deleteSuccess">{{ deleteSuccess }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const newPassword = ref('');
const errorUser = ref('');
const successMessage = ref('');
const userCourses = ref([]);
const noCoursesFound = ref(false);
const deleteError = ref('');
const deleteSuccess = ref('');
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await fetchUserCourses();
});

const fetchUserCourses = async () => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/autoschool-1bc84/databases/(default)/documents/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.user?.idToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    userCourses.value = data.documents.filter(doc => doc.fields.userId.stringValue === userStore.user?.localId).map(doc => doc.fields);
    noCoursesFound.value = userCourses.value.length === 0;
  } catch (error) {
    console.error('Ошибка при получении данных о курсах:', error);
  }
};

const changePassword = async () => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB9Cx6vMAu9DgAY4Ey2R199ZEc-IjXeQGM`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: userStore.user?.idToken,
        password: newPassword.value,
        returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    successMessage.value = 'Пароль успешно изменен.';
    newPassword.value = '';
    errorUser.value = '';
  } catch (error) {
    errorUser.value = error.message;
    successMessage.value = '';
  }
};

const deleteAccount = async () => {
  if (!userStore.user?.idToken) {
    console.error('Токен пользователя отсутствует или недействителен.');
    router.push('/auth');
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyB9Cx6vMAu9DgAY4Ey2R199ZEc-IjXeQGM`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: userStore.user?.idToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    deleteSuccess.value = 'Аккаунт успешно удален.';
    deleteError.value = '';
    userStore.logout();
    router.push('/auth');
  } catch (error) {
    deleteError.value = error.message;
    deleteSuccess.value = '';
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.change-password,
.delete-account {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dashboard h2 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.change-password h3,
.delete-account h3 {
  font-size: 22px;
  margin-bottom: 15px;
}

.dashboard input[type="password"],
.dashboard button {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dashboard input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
}

.dashboard button {
  background-color: #007bff;
  color: white;
  border: none;
}

.dashboard button:hover {
  background-color: #0056b3;
}

.dashboard p {
  color: #d9534f; /* Цвет для ошибок */
}

.dashboard p:nth-of-type(n+2) {
  color: #5cb85c; /* Цвет для успешных сообщений */
}

.dashboard ul {
  list-style-type: none;
  padding-left: 0;
}

.dashboard li {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

.dashboard li:last-child {
  border-bottom: none;
}

@media (max-width: 600px) {
  .dashboard {
    padding: 15px;
  }

  .dashboard h2 {
    font-size: 24px;
  }

  .change-password h3,
  .delete-account h3 {
    font-size: 20px;
  }

  .dashboard input[type="password"],
  .dashboard button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
