import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from "../stores/counter.js";
import AppAuth from '../../../../project/vueproject/src/components/AppAuth.vue';
import AppCourses from '../../../../project/vueproject/src/components/AppCourses.vue';
import AppBooking from '../../../../project/vueproject/src/components/AppBooking.vue';
import AppStudentDashboard from '../../../../project/vueproject/src/components/AppStudentDashboard.vue';
import AppReviews from '../../../../project/vueproject/src/components/AppReviews.vue';
import AppContact from '../../../../project/vueproject/src/components/AppContact.vue';
import AppNews from '../../../../project/vueproject/src/components/AppNews.vue';
import AppReg from '../../../../project/vueproject/src/components/AppReg.vue';
import {storeToRefs} from "pinia";

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
router.beforeEach((to, from) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userStore = useUserStore()
  const { isAuth } = storeToRefs(userStore);

  if (requiresAuth && !isAuth.value) {
    return { path :"/auth" }
  }
})
export default router;
