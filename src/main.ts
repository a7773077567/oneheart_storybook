import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/assets/scss/main.scss';

// Quasar
import GoogleLogin from './plugins/googleLogin';
import Quasar from '@/plugins/quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';

// MSW
import { enableMocking } from '@/mocks/browser';

// Zod
import Zod from '@/plugins/zod';

// Components
import Components from '@/plugins/components';

const app = createApp(App);

// ========== disable mocking ==========
// app.use(createPinia()).use(router).use(Quasar).use(Zod).use(GoogleLogin).use(Components).mount('#app');

// ========== enable mocking ==========
enableMocking()?.then(() => {
  app.use(createPinia()).use(router).use(Quasar).use(Zod).use(Components).use(GoogleLogin).mount('#app');
});
