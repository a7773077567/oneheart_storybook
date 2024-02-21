import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
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
        },
      },
      {
        path: '/appointment',
        name: 'appointment',
        redirect: { name: 'appointmentList' },
        meta: {
          label: '客戶預約',
        },
        children: [
          {
            path: 'list',
            name: 'appointmentList',
            component: () => import('@/views/appointment/List.vue'),
            meta: {
              label: '預約列表',
            },
          },
          {
            path: 'booking',
            name: 'appointmentBooking',
            component: () => import('@/views/appointment/Booking.vue'),
            meta: {
              label: '預約',
            },
          },
          {
            path: 'current-query',
            name: 'appointmentCurrentQuery',
            component: () => import('@/views/appointment/CurrentQuery.vue'),
            meta: {
              label: '查詢預約',
            },
          },
          {
            path: 'history-query',
            name: 'appointmentHistoryQuery',
            component: () => import('@/views/appointment/HistoryQuery.vue'),
            meta: {
              label: '查詢紀錄',
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
        },
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('@/views/store/Store.vue'),
        meta: {
          label: '商城',
        },
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/Order.vue'),
        meta: {
          label: '訂單與付款',
        },
      },
      {
        path: '/schedule',
        name: 'schedule',
        redirect: { name: 'scheduleList' },
        meta: {
          label: '排班',
        },
        children: [
          {
            path: 'list',
            name: 'scheduleList',
            component: () => import('@/views/schedule/List.vue'),
            meta: {
              label: '班表列表 ',
            },
          },
          {
            path: 'shift',
            name: 'scheduleShift',
            component: () => import('@/views/schedule/Shift.vue'),
            meta: {
              label: '新增班別',
            },
          },
          {
            path: 'query',
            name: 'scheduleQuery',
            component: () => import('@/views/schedule/Query.vue'),
            meta: {
              label: '查詢班表',
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
        },
      },
      {
        path: '/gym',
        name: 'gym',
        component: () => import('@/views/gym/Gym.vue'),
        meta: {
          label: '場館管理',
        },
      },

    ],
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
