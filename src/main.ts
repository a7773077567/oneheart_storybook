import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// must import before router, to access router in interceptor
import '@/utils/api';

import router from './router';

// Quasar
import GoogleLogin from './plugins/googleLogin';
import Quasar from '@/plugins/quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';
import '@/assets/scss/main.scss';

// MSW
import { enableMocking } from '@/mocks/browser';

// Zod
import Zod from '@/plugins/zod';

// Components
import Components from '@/plugins/components';

const app = createApp(App);

// ========== disable mocking ==========
app.use(createPinia()).use(router).use(Quasar).use(Zod).use(GoogleLogin).use(Components).mount('#app');

// ========== enable mocking ==========
// enableMocking()?.then(() => {
//   app.use(createPinia()).use(router).use(Quasar).use(Zod).use(Components).use(GoogleLogin).mount('#app');
// });
