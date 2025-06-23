import type { RouteRecordRaw } from 'vue-router';
import type { PermissionEvents } from '@/const/permission';

export const reportRoutes: RouteRecordRaw[] = [{
  path: '/report',
  name: 'report',
  component: () => import('@/views/report/Index.vue'),
  redirect: { name: 'payrollExport' },
  meta: {
    label: '報表管理',
    requiredAuth: true,
    icon: 'plagiarism',
    permissions: ['VIEW_PAYROLL_EXPORT'] as PermissionEvents[],
  },
  children: [
    {
      path: 'appointment',
      name: 'appointmentExport',
      component: () => import('@/views/report/AppointmentExport.vue'),
      meta: {
        label: '匯出報表 - 預約單',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'first-visit-patient',
      name: 'firstVisitExport',
      component: () => import('@/views/report/FirstVisitExport.vue'),
      meta: {
        label: '匯出報表 - 初診客戶',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'payroll',
      name: 'payrollExport',
      component: () => import('@/views/report/PayrollExport.vue'),
      meta: {
        label: '匯出報表 - 薪資報表',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'coach-payroll',
      name: 'coachPayrollExport',
      component: () => import('@/views/report/CoachPayrollExport.vue'),
      meta: {
        label: '匯出報表 - 教練薪資報表',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'counter-payroll',
      name: 'counterPayrollExport',
      component: () => import('@/views/report/CounterPayrollExport.vue'),
      meta: {
        label: '匯出報表 - 櫃檯薪資報表',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
    {
      path: 'payroll-for-hr',
      name: 'payrollExport4HR',
      component: () => import('@/views/report/PayrollExport4HR.vue'),
      meta: {
        label: '匯出報表 - 薪資報表 for HR',
        requiredAuth: true,
        hideFromNav: true,
      },
    },
  ],
}];
