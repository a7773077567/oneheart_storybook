import type { RouteRecordRaw } from 'vue-router';

export const printRoutes: RouteRecordRaw[] = [
  {
    path: '/receipt-print',
    name: 'receiptPrint',
    component: () => import('@/views/print/ReceiptPrintView.vue'),
  },
  {
    path: '/cash-drop-print',
    name: 'cashDropPrint',
    component: () => import('@/views/print/CashDropPrintView.vue'),
  },
  {
    path: '/hand-over-print',
    name: 'handoverPrint',
    component: () => import('@/views/print/HandoverPrintView.vue'),
  },
];
