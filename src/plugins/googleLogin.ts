import type { App } from 'vue';
import Vue3GoogleLogin from 'vue3-google-login';

export default {
  install(app: App) {
    app.use(Vue3GoogleLogin, {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    });
  },
};
