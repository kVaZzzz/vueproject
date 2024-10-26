<template>
  <div class="dashboard">
    <div class="change-password">
      <h3>Изменить пароль</h3>
      <input type="password" v-model="newPassword" placeholder="Новый пароль" required />
      <button @click="changePassword">Сменить пароль</button>
      <p v-if="errorUser">{{ errorUser }}</p>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
    <h2>Личный кабинет студента</h2>

    <ul v-if="userCourses.length">
      <li v-for="(course, index) in userCourses" :key="index">
        {{ course.course }} - Дата начала: {{ course.startDate }}
      </li>
    </ul>
    <p v-else>Нет записанных курсов.</p>
  </div>
</template>

<script>
import { getAuth, updatePassword } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from "@/main.js";

export default {
  data() {
    return {
      userCourses: [],
      newPassword: '',
      errorUser: '',
      successMessage: '',
      currentUserId: 'user123', // Замените на актуальный ID текущего пользователя
    };
  },
  created() {
    this.fetchUserCourses();
  },
  methods: {
    fetchUserCourses() {
      const firebaseRef = ref(database, 'booking');

      onValue(firebaseRef, (snapshot) => {
        const coursesArray = [];
        snapshot.forEach((childSnapshot) => {
          const courseData = childSnapshot.val();
          if (courseData.userId === this.currentUserId) {
            coursesArray.push(courseData);
          }
        });
        this.userCourses = coursesArray;
      }, {
        onlyOnce: true
      });
    },
    changePassword() {
      const userAuth = getAuth();
      const user = userAuth.currentUser; // Получаем текущего пользователя

      if (user) {
        updatePassword(user, this.newPassword)
          .then(() => {
            this.successMessage = 'Пароль успешно изменен.';
            this.newPassword = ''; // Сброс поля нового пароля
            this.errorUser = ''; // Сброс ошибки
          })
          .catch((error) => {
            this.errorUser = error.message;
            this.successMessage = ''; // Сброс сообщения об успехе
          });
      } else {
        this.errorUser = 'Пользователь не аутентифицирован.';
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: auto;
}

.dashboard h3 {
  margin-top: .5rem;
}

.dashboard ul {
  list-style-type: none;
  padding-left: .5rem;
}

.change-password {
  margin-top: 20px;
}

.dashboard a {
  color: #007bff;
  text-decoration: none;
}

.dashboard a:hover {
  text-decoration: underline;
}
</style>
