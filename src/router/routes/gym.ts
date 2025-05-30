import type { RouteRecordRaw } from 'vue-router';

export const gymRoutes: RouteRecordRaw[] = [
  {
    path: '/gym',
    name: 'gym',
    component: () => import('@/views/gym/Gym.vue'),
    meta: {
      label: '場館管理',
      requiredAuth: true,
      permissions: ['VIEW_SPACE_MANAGEMENT'],
      icon: 'o_apartment',
    },
  },
];
