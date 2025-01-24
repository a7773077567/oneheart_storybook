import type { RouteRecordRaw } from 'vue-router';

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/order/Order.vue'),
    meta: {
      label: '交易管理',
      requiredAuth: true,
      permission: true,
      icon: 'attach_money',
    },
    redirect: { name: 'pointsTopup' },
    children: [
      {
        path: 'points-topup',
        name: 'pointsTopup',
        component: () => import('@/views/order/point/PointTransaction.vue'),
        meta: {
          label: '堂數儲值與退款',
          requiredAuth: true,
        },
      },
      {
        path: 'group-class-voucher',
        name: 'GroupClassVoucher',
        component: () => import('@/views/order/voucher/GroupClassVoucher.vue'),
        meta: {
          label: '功能性團課券',
          requiredAuth: true,
        },
      },
      {
        path: 'transaction-records',
        name: 'transactionRecords',
        component: () => import('@/views/order/TransactionRecords.vue'),
        meta: {
          label: '查詢交易紀錄',
          requiredAuth: true,
        },
      },

    ],
  },
];
