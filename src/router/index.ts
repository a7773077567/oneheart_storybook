import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: loginGuard,
    meta: {
      requiredAuth: false,
    },
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/Layout.vue'),
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          label: '首頁',
          requiredAuth: true,
        },
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
        path: '/schedule',
        name: 'schedule',
        redirect: { name: 'scheduleList' },
        meta: {
          label: '排班',
          requiredAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'scheduleList',
            component: () => import('@/views/schedule/List.vue'),
            meta: {
              label: '班表列表 ',
              requiredAuth: true,
            },
          },
          {
            path: 'shift',
            name: 'scheduleShift',
            component: () => import('@/views/schedule/Shift.vue'),
            meta: {
              label: '新增班別',
              requiredAuth: true,
            },
          },
          {
            path: 'query',
            name: 'scheduleQuery',
            component: () => import('@/views/schedule/Query.vue'),
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
  // Delegate guard to login beforeEnter
  if (to.name === 'login') {
    return;
  }

  const isAuthenticated = await checkAuth();
  const needAuth = to.meta.requiredAuth;
  if (needAuth && !isAuthenticated) {
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
