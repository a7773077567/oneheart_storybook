import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    beforeEnter: loginGuard,
    meta: {
      requiredAuth: false,
    },
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/login/Forget.vue'),
    redirect: { name: 'email' },
    beforeEnter: loginGuard,
    children: [
      {
        path: 'email',
        name: 'email',
        component: () => import('@/views/login/Email.vue'),
        meta: {
          requireAuth: false,
        },
      },
      {
        path: 'confirm',
        name: 'confirm',
        component: () => import('@/views/login/Confirm.vue'),
        meta: {
          requireAuth: false,
        },
        props: route => ({ userId: route.query.id }),
      },
    ],
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/Layout.vue'),
    redirect: { name: 'home' },
    meta: {
      requiredAuth: true,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        redirect: { name: 'dashboard' },
        meta: {
          label: '首頁',
          requiredAuth: true,
        },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('@/views/home/Dashboard.vue'),
            meta: {
              label: '儀表板',
              requiredAuth: true,
            },
          },
          {
            path: 'user-settings',
            component: () => import('@/views/home/UserSettings.vue'),
            name: 'userSettings',
            meta: {
              label: '個人設定',
              requiredAuth: true,

            },
          },
        ],
      },
      {
        path: '/appointment',
        name: 'appointment',
        redirect: { name: 'appointmentList' },
        meta: {
          label: '客戶預約',
          requiredAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'appointmentList',
            component: () => import('@/views/appointment/List.vue'),
            meta: {
              label: '預約列表',
              requiredAuth: true,
            },
          },
          {
            path: 'booking',
            name: 'appointmentBooking',
            component: () => import('@/views/appointment/Booking.vue'),
            meta: {
              label: '預約',
              requiredAuth: true,
            },
          },
          {
            path: 'current-query',
            name: 'appointmentCurrentQuery',
            component: () => import('@/views/appointment/CurrentQuery.vue'),
            meta: {
              label: '查詢預約',
              requiredAuth: true,
            },
          },
          {
            path: 'history-query',
            name: 'appointmentHistoryQuery',
            component: () => import('@/views/appointment/HistoryQuery.vue'),
            meta: {
              label: '查詢紀錄',
              requiredAuth: true,
            },
          },
        ],
      },
      {
        path: '/client',
        name: 'client',
        component: () => import('@/views/client/Client.vue'),
        meta: {
          label: '客戶管理',
          requiredAuth: true,
        },
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('@/views/store/Store.vue'),
        meta: {
          label: '商城',
          requiredAuth: true,
        },
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/Order.vue'),
        meta: {
          label: '訂單與付款',
          requiredAuth: true,
        },
      },
      {
        path: '/shift',
        name: 'shift',
        redirect: { name: 'shiftList' },
        meta: {
          label: '排班',
          requiredAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'shiftList',
            component: () => import('@/views/shift/List.vue'),
            meta: {
              label: '班表列表 ',
              requiredAuth: true,
            },
          },
          {
            path: 'shift',
            name: 'shiftShift',
            component: () => import('@/views/shift/Shift.vue'),
            meta: {
              label: '新增班別',
              requiredAuth: true,
            },
          },
          {
            path: 'query',
            name: 'shiftQuery',
            component: () => import('@/views/shift/Query.vue'),
            meta: {
              label: '查詢班表',
              requiredAuth: true,
            },
          },
        ],
      },
      {
        path: '/staff',
        name: 'staff',
        component: () => import('@/views/staff/Staff.vue'),
        meta: {
          label: '人員設定',
          requiredAuth: true,
        },
      },
      {
        path: '/gym',
        name: 'gym',
        component: () => import('@/views/gym/Gym.vue'),
        meta: {
          label: '場館管理',
          requiredAuth: true,
        },
      },

    ],
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const needAuth = to.meta.requiredAuth;
  if (!needAuth) {
    return;
  }
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { name: 'login' };
  }
});

async function checkAuth() {
  const userStore = useUserStore();
  try {
    await userStore.getUserInfo();
    return true;
  }
  catch {
    return false;
  }
}

async function loginGuard() {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    return { name: 'home' };
  }
}

export default router;
