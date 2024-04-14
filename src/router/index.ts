import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useAppointmentStore, useUserStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    redirect: { name: 'userLogin' },
    children: [
      {
        path: 'user-login',
        name: 'userLogin',
        component: () => import('@/views/login/UserLogin.vue'),
        beforeEnter: loginGuard,
      },
      {
        path: 'space-login',
        name: 'spaceLogin',
        component: () => import('@/views/login/SpaceLogin.vue'),
        meta: {
          requiredAuth: true,
        },
      },
    ],
  },
  {
    path: '/activate',
    name: 'activate',
    component: () => import('@/views/login/Activate.vue'),
    children: [
      {
        path: 'email',
        name: 'activateEmail',
        component: () => import('@/views/login/ActivateEmail.vue'),
        meta: {
          requiredAuth: true,
        },
      },
      {
        path: 'password',
        name: 'activatePassword',
        component: () => import('@/views/login/ActivatePassword.vue'),
      },
    ],
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
        props: route => ({ token: route.query.token }),
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
            component: () => import('@/views/appointment/AppointmentListView.vue'),
            redirect: { name: 'appointmentCalendar' },
            meta: {
              label: '預約列表',
              requiredAuth: true,
            },
            children: [
              {
                path: 'calendar',
                name: 'appointmentCalendar',
                component: () => import('@/views/appointment/AppointmentCalendarView.vue'),
                meta: {
                  label: '列表',
                  requiredAuth: true,
                },
              },
              {
                path: 'info/:type',
                name: 'appointmentInfo',
                component: () => import('@/views/appointment/InfoView.vue'),
                meta: {
                  label: '預約資料',
                  requiredAuth: true,
                },
                props: true,
              },
            ],
          },
          {
            path: 'booking',
            name: 'appointmentBooking',
            component: () => import('@/views/appointment/AppointmentBookingView.vue'),
            meta: {
              label: '預約',
              requiredAuth: true,
            },
          },
          {
            path: 'current-query',
            name: 'appointmentCurrentQuery',
            component: () => import('@/views/appointment/AppointmentCurrentQueryView.vue'),
            redirect: { name: 'appointmentCurrentQueryList' },
            meta: {
              label: '查詢預約',
              requiredAuth: true,
            },
            children: [
              {
                path: 'list',
                name: 'appointmentCurrentQueryList',
                component: () => import('@/views/appointment/AppointmentCurrentQueryListView.vue'),
                meta: {
                  requiredAuth: true,
                },
              },
              {
                path: 'rearrange',
                name: 'appointmentCurrentQueryRearrange',
                component: () => import('@/views/appointment/AppointmentCurrentQueryRearrangeView.vue'),
                meta: {
                  requiredAuth: true,
                },
                beforeEnter: rearrangeGuard,
              },
            ],
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
            path: 'template',
            name: 'shiftTemplate',
            component: () => import('@/views/shift/Template.vue'),
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
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/UserView.vue'),
        redirect: { name: 'userList' },
        meta: {
          label: '人員設定',
          requiredAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'userList',
            component: () => import('@/views/user/ListView.vue'),
            children: [
              {
                path: 'edit',
                name: 'userEdition',
                component: () => import('@/views/user/EditView.vue'),
                meta: {
                  label: '編輯',
                  requiredAuth: true,
                  notShownInSidebar: true,
                },
              },
            ],
            meta: {
              label: '人員總表',
              requiredAuth: true,
            },
          },
          // {
          //   path: 'list/edit',
          //   name: 'userEdition',
          //   component: () => import('@/views/user/EditView.vue'),
          //   meta: {
          //     label: '編輯',
          //     requiredAuth: true,
          //     notShownInSidebar: true,
          //   },
          // },
        ],
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

function rearrangeGuard() {
  const appointmentStore = useAppointmentStore();
  if (!appointmentStore.targetClientScheduleNotStarted) {
    router.push({ name: 'appointmentCurrentQuery' });
  }
}

export default router;
