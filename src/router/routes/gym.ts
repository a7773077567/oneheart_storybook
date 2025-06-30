import type { RouteRecordRaw } from 'vue-router';

export const gymRoutes: RouteRecordRaw[] = [
  {
    path: '/space-manage',
    name: 'spaceManage',
    component: () => import('@/views/space/SpaceManage.vue'),
    meta: {
      label: '場館管理',
      requiredAuth: true,
      permissions: ['VIEW_SPACE_MANAGEMENT'],
      icon: 'o_apartment',
    },
  },
];
