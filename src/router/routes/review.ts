import type { RouteRecordRaw } from 'vue-router';
import type { PermissionEvents } from '@/const/permission';

export const reviewRoutes: RouteRecordRaw[] = [{
  path: '/review',
  name: 'review',
  component: () => import('@/views/home/review/Index.vue'),
  redirect: { name: 'reviewBonus' },
  meta: {
    label: '審核與批准',
    requiredAuth: true,
    permissions: ['EDIT_REVIEW'] as PermissionEvents[],
  },
  children: [
    {
      path: 'bonus',
      name: 'reviewBonus',
      component: () => import('@/views/home/review/ReviewBonus.vue'),
      meta: {
        label: '積分與獎金審核',
        requiredAuth: true,
        hideFromNav: true,
        permissions: ['EDIT_REVIEW'] as PermissionEvents[],
      },
    },
  ],
}];
