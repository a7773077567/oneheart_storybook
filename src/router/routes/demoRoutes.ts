import type { RouteRecordRaw } from 'vue-router';

export const demoRoutes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: 'demoPage',
    component: () => import('@/views/Demo.vue'),
    meta: {
      requiredAuth: false,
    },
  },
];
