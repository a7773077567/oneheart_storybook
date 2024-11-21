export const cashDropHandoverRoutes = [
  {
    path: 'cash-drop-handover',
    name: 'cashDropHandover',
    redirect: { name: 'cashDrop' },
    meta: {
      label: '投庫交班',
      requiredAuth: true,
      permission: true,
    },
    children: [
      {
        path: 'cash-drop',
        name: 'cashDrop',
        component: () => import('@/views/cashDrop/CashDropView.vue'),
        meta: {
          label: '投庫',
          requiredAuth: true,
        },
      },
      {
        path: 'handover',
        name: 'handover',
        component: () => import('@/views/cashDrop/HandoverView.vue'),
        meta: {
          label: '交班',
          requiredAuth: true,
        },
      },
      {
        path: 'cash-drop-records',
        name: 'cashDropRecords',
        component: () => import('@/views/cashDrop/CashDropRecordsView.vue'),
        meta: {
          label: '投庫紀錄',
          requiredAuth: true,
        },
      },
      {
        path: 'handover-records',
        name: 'handoverRecords',
        component: () => import('@/views/cashDrop/HandoverRecordsView.vue'),
        meta: {
          label: '交班紀錄',
          requiredAuth: true,
        },
      },
    ],
  },
];
