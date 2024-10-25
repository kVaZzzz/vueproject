import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { getDatabase } from 'firebase/database';
import {getStorage} from "firebase/storage"
import {getAuth } from "firebase/auth";
import { createPinia } from 'pinia'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCMgMsv3uzKbAuV-46tUF6gULWaFRmPt-Q",
  authDomain: "autoschool1-c7224.firebaseapp.com",
  databaseURL: "https://autoschool1-c7224-default-rtdb.firebaseio.com",
  projectId: "autoschool1-c7224",
  storageBucket: "autoschool1-c7224.appspot.com",
  messagingSenderId: "920491183602",
  appId: "1:920491183602:web:87423132b2e21fd64def6b"
};

const apps = initializeApp(firebaseConfig);
const storage = getStorage(apps)
const auth = getAuth(apps)
const app = createApp(App)
const database = getDatabase(apps);
// Initialize Firebase
createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app');
export {database,storage,auth,apps }

