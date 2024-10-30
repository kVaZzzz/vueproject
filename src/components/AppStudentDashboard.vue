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
      this.currentUserId = user.uid;
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

        onValue(userCoursesRef, (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const courseData = childSnapshot.val();
            if (courseData.userId === user.uid) {
              remove(ref(database, `booking/${childSnapshot.key}`));
            }
          });
        });

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
  color: #d9534f;
}

.dashboard p:nth-of-type(n+2) {
  color: #5cb85c;
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
</style>
