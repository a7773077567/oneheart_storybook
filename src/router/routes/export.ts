import type { RouteRecordRaw } from 'vue-router';

export const exportRoutes: RouteRecordRaw[] = [{
  path: '/export',
  name: 'export',
  component: () => import('@/views/export/Index.vue'),
  redirect: { name: 'payrollExport' },
  meta: {
    label: '報表管理',
    requiredAuth: true,
    icon: 'plagiarism',
  },
  children: [
    {
      path: 'appointment',
      name: 'appointmentExport',
      component: () => import('@/views/export/AppointmentExport.vue'),
      meta: {
        label: '匯出報表 - 預約單',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'first-visit-patient',
      name: 'firstVisitExport',
      component: () => import('@/views/export/FirstVisitExport.vue'),
      meta: {
        label: '匯出報表 - 初診客戶',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'payroll',
      name: 'payrollExport',
      component: () => import('@/views/export/PayrollExport.vue'),
      meta: {
        label: '匯出報表 - 薪水報表',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
  ],
}];
