import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import { Cookies, Dialog, Loading, Notify, Quasar } from 'quasar';
import quasarLang from 'quasar/lang/zh-TW';

import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';
import '@/assets/scss/main.scss';

setup((app) => {
  app.use(Quasar, {
    lang: quasarLang,
    plugins: {
      Cookies,
      Notify,
      Dialog,
      Loading,
    },
  });
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
