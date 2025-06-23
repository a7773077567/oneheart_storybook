declare module 'apextree'

// src/types/svg.d.ts
declare module '*.svg?component' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
