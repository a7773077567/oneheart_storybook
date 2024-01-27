import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/assets/scss/main.scss';

// Quasar
import Quasar from '@/plugins/quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';

// MSW
import { enableMocking } from '@/mocks/browser';

const app = createApp(App);
app.use(createPinia()).use(router).use(Quasar);

// ========== Close Intercepting ==========
app.mount('#app');

// ========== Open Intercepting ==========
// enableMocking()?.then(() => {
//   app.mount('#app');
// });
