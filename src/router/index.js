import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from "../stores/counter.js";
import AppAuth from '../components/AppAuth.vue';
import AppCourses from '../components/AppCourses.vue';
import AppBooking from '../components/AppBooking.vue';
import AppStudentDashboard from '../components/AppStudentDashboard.vue';
import AppReviews from '../components/AppReviews.vue';
import AppContact from '../components/AppContact.vue';
import AppNews from '../components/AppNews.vue';
import AppReg from '../components/AppReg.vue';
import { storeToRefs } from "pinia";

const routes = [
  { path: '/auth', component: AppAuth },
  { path: '/reg', component: AppReg },
  { path: '/courses', component: AppCourses },
  { path: '/booking', component: AppBooking },
  { path: '/dashboard', component: AppStudentDashboard },
  { path: '/reviews', component: AppReviews },
  { path: '/contact', component: AppContact },
  { path: '/news', component: AppNews },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
