import type { App } from 'vue';

const modules = import.meta.glob<true, string, any>(['@/components/shared/**/*', '!@/components/shared/index.ts'], { eager: true });

export default {
  install(app: App) {
    Object.entries(modules).forEach(([key, module]) => {
      const name = extractName(key);
      const component = module.default;
      app.component(name, component);
    });
  },
};

function extractName(key: string) {
  return key.split('/').at(-1)?.split('.')[0] as string;
}
