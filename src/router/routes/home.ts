import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores';
import { RoleType } from '@/api/user';

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'dashboard' },
    meta: {
      label: '首頁',
      requiredAuth: true,
      permission: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => {
          const userStore = useUserStore();
          return getRoleDashboard(userStore.role);
        },
        meta: {
          label: '儀表板',
          requiredAuth: true,
        },
      },
      {
        path: 'personal-appointments',
        name: 'personalAppointments',
        component: () => import('@/views/home/PersonalAppointmentsView.vue'),
        meta: {
          label: '個人預約列表',
          requiredAuth: true,
        },
      },
      {
        path: 'user-settings',
        component: () => import('@/views/home/UserSettingsView.vue'),
        name: 'userSettings',
        meta: {
          label: '個人設定',
          requiredAuth: true,
        },
      },
    ],
  },
];

function getRoleDashboard(role: RoleType) {
  switch (role) {
    case RoleType['院長']:
    case RoleType['副院長']:
    case RoleType['系統管理者']:
      return import('@/views/home/AdminDashboard.vue');
    case RoleType['物理治療師']:
    case RoleType['物理治療師組長']:
      return import('@/views/home/TherapistDashboard.vue');
    case RoleType['櫃檯']:
      return import('@/views/home/ReceptionDashboard.vue');
    case RoleType['教練']:
    case RoleType['教練組長']:
    case RoleType['店長']:
    case RoleType['副店長']:
    default:
      return import('@/views/home/CoachDashboard.vue');
  }
}
