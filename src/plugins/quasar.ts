import type { App } from 'vue';
import { Cookies, Quasar } from 'quasar';
import quasarLang from 'quasar/lang/zh-TW';

export default {
  install(app: App) {
    app.use(Quasar, {
      lang: quasarLang,
      plugins: {
        Cookies,
      },
    });
  },
};
