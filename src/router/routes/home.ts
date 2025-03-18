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
      icon: 'o_home',
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/home/Dashboard.vue'),
        // component: () => {
        //   const userStore = useUserStore();
        //   return getRoleDashboard(userStore.role);
        // },
        meta: {
          label: '儀表板',
          requiredAuth: true,
        },
        children: [
          {
            path: 'traffic-light-overview/:userId',
            component: () => import('@/views/home/TrafficLightOverview.vue'),
            name: 'trafficLightOverview',
            props: true,
            meta: {
              label: '紅綠燈分數詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/:userId/referral-count',
            component: () => import('@/views/home/indicator/ReferralCountView.vue'),
            name: 'referralCountView',
            props: true,
            meta: {
              label: '轉介數計分詳情',
              requiredAuth: true,
            },
          },
        ],
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
      {
        path: 'google-review',
        name: 'googleReview',
        component: () => import('@/views/home/GoogleReviewView.vue'),
        meta: {
          label: 'Google評論管理',
          requiredAuth: true,
        },
      },
    ],
  },
];
