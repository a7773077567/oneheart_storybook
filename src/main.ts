// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';

// Import Quasar css
import 'quasar/dist/quasar.css';

import '@/assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import Quasar from '@/plugins/quasar';

const app = createApp(App);

app.use(createPinia()).use(router).use(Quasar);

app.mount('#app');
