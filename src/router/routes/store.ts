import type { RouteRecordRaw } from 'vue-router';

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: '/store',
    name: 'store',
    component: () => import('@/views/store/Store.vue'),
    meta: {
      label: '商城',
      requiredAuth: true,
      permission: false,
    },
  },
];
