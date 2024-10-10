import type { RouteRecordRaw } from 'vue-router';

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
        component: () => import('@/views/home/DashboardView.vue'),
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
