import type { RouteRecordRaw } from 'vue-router';

export const printRoutes: RouteRecordRaw[] = [
  {
    path: '/receipt-print',
    name: 'receiptPrint',
    component: () => import('@/views/print/ReceiptPrintView.vue'),
  },
];
