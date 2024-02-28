import type { App } from 'vue';
import { OInput, OSelect } from '@/components/shared';

export default {
  install(app: App) {
    app.component('OInput', OInput);
    app.component('OSelect', OSelect);
  },
};
