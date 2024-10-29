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
    <p v-else-if="noCoursesFound">Нет записанных курсов.</p>

    <div class="delete-account">
      <h3>Удалить аккаунт</h3>
      <button @click="deleteAccount">Удалить мой аккаунт</button>
      <p v-if="deleteError">{{ deleteError }}</p>
      <p v-if="deleteSuccess">{{ deleteSuccess }}</p>
    </div>
  </div>
</template>

<script>
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { database } from "@/main.js";

export default {
  data() {
    return {
      userCourses: [],
      newPassword: '',
      errorUser: '',
      successMessage: '',
      noCoursesFound: false,
      deleteError: '',
      deleteSuccess: '',
      currentUserId: null,
    };
  },

  created() {
    this.fetchUserCourses();
    const userAuth = getAuth();
    const user = userAuth.currentUser;

    if (user) {
      this.currentUserId = user.uid; // Получаем uid из объекта user
      console.log('Текущий ID пользователя:', this.currentUserId);
    } else {
      console.error('Пользователь не аутентифицирован.');
    }
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
        console.log('Полученные курсы:', coursesArray);
        this.userCourses = coursesArray;
        this.noCoursesFound = coursesArray.length === 0;
      }, {
        onlyOnce: true
      });
    },

    changePassword() {
      const userAuth = getAuth();
      const user = userAuth.currentUser;

      if (user) {
        updatePassword(user, this.newPassword)
          .then(() => {
            this.successMessage = 'Пароль успешно изменен.';
            this.newPassword = '';
            this.errorUser = '';
          })
          .catch((error) => {
            this.errorUser = error.message;
            this.successMessage = '';
          });
      } else {
        this.errorUser = 'Пользователь не аутентифицирован.';
      }
    },

    deleteAccount() {
      const userAuth = getAuth();
      const user = userAuth.currentUser;

      if (user) {
        const userCoursesRef = ref(database, 'booking');

        // Удаляем курсы пользователя
        onValue(userCoursesRef, (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const courseData = childSnapshot.val();
            if (courseData.userId === user.uid) {
              remove(ref(database, `booking/${childSnapshot.key}`));
            }
          });
        });

        // Удаляем аккаунт пользователя
        deleteUser(user)
          .then(() => {
            this.deleteSuccess = 'Аккаунт успешно удален.';
            this.deleteError = '';
          })
          .catch((error) => {
            this.deleteError = error.message;
            this.deleteSuccess = '';
          });
      } else {
        this.deleteError = 'Пользователь не аутентифицирован.';
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

.change-password,
.delete-account {
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
