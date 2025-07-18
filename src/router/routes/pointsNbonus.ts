import type { RouteRecordRaw } from 'vue-router';
import type { PermissionEvents } from '@/const/permission';

export const pointNbonus: RouteRecordRaw[] = [
  {
    path: 'points-bonus-manage',
    name: 'pointsNbonus',
    component: () => import('@/views/home/pointsNbonues/Index.vue'),
    redirect: { name: 'googleReview' },
    meta: {
      label: '積分與獎金管理',
      requiredAuth: true,
      permissions: ['VIEW_POINTS_BONUS'],
    },
    children: [
      {
        path: 'google-review',
        name: 'googleReview',
        component: () => import('@/views/home/pointsNbonues/GoogleReviewView.vue'),
        meta: {
          label: 'Google評論管裡',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'education-points',
        name: 'educationPoints',
        component: () => import('@/views/home/pointsNbonues/EducationPointsView.vue'),
        meta: {
          label: '教育積分管理',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'relocation-bonus',
        name: 'relocationBonus',
        component: () => import('@/views/home/pointsNbonues/RelocationBonus.vue'),
        meta: {
          label: '外派獎金',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'writing-allowance',
        name: 'writingAllowance',
        component: () => import('@/views/home/pointsNbonues/WritingAllowance.vue'),
        meta: {
          label: '寫作津貼',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'training-allowance',
        name: 'trainingAllowance',
        component: () => import('@/views/home/pointsNbonues/TrainingAllowance.vue'),
        meta: {
          label: '培訓津貼',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'support-bonus',
        name: 'supportBonus',
        component: () => import('@/views/home/pointsNbonues/SupportBonus.vue'),
        meta: {
          label: '支援獎金',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
      {
        path: 'other-allowance',
        name: 'otherAllowance',
        component: () => import('@/views/home/pointsNbonues/OtherAllowance.vue'),
        meta: {
          label: '其他津貼',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'] as PermissionEvents[],
        },
      },
    ],
  },
];
