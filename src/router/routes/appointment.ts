import { useAppointmentStore } from '@/stores';
import { type RouteRecordRaw, useRouter } from 'vue-router';

export const appointmentRoutes: RouteRecordRaw[] = [
  {
    path: '/appointment',
    name: 'appointment',
    redirect: { name: 'appointmentList' },
    meta: {
      label: '客戶預約',
      requiredAuth: true,
      permission: true,
    },
    children: [
      {
        path: 'list',
        name: 'appointmentList',
        redirect: { name: 'appointmentListCalendar' },
        meta: {
          label: '預約列表',
          requiredAuth: true,
        },
        children: [
          {
            path: 'calendar',
            name: 'appointmentListCalendar',
            component: () => import('@/views/appointment/list/AppointmentListCalendarView.vue'),
            meta: {
              label: '列表',
              requiredAuth: true,
            },
          },
          {
            path: 'info/:scheduleId',
            name: 'appointmentListInfo',
            component: () => import('@/views/appointment/list/AppointmentListInfoView.vue'),
            meta: {
              label: '預約資料',
              requiredAuth: true,
            },
            props: true,
          },
          {
            path: 'checkout/:scheduleId',
            name: 'appointmentListCheckout',
            component: () => import('@/views/appointment/list/AppointmentListCheckoutView.vue'),
            meta: {
              label: '結帳',
              requiredAuth: true,
            },
            props: true,
          },
        ],
      },
      {
        path: 'booking',
        name: 'appointmentBooking',
        redirect: { name: 'appointmentBookingQuery' },
        meta: {
          label: '預約',
          requiredAuth: true,
        },
        children: [
          {
            path: 'query',
            name: 'appointmentBookingQuery',
            component: () => import('@/views/appointment/booking/AppointmentBookingQueryView.vue'),
            meta: {
              label: '查詢可預約時間',
              requireAuth: true,
            },
          },
          {
            path: 'calendar',
            name: 'appointmentBookingCalendar',
            component: () => import('@/views/appointment/booking/AppointmentBookingCalendarView.vue'),
            meta: {
              label: '選擇可預約時間',
              requireAuth: true,
            },
            beforeEnter: (to, from) => {
              if (!from.name) {
                return { name: 'appointmentBookingQuery' };
              }
            },
          },
          {
            path: 'machine-calendar/:machineType',
            name: 'machineBookingCalendar',
            props: true,
            component: () => import('@/views/appointment/booking/MachineBookingCalendarView.vue'),
            meta: {
              label: '選擇可預約時間',
              requireAuth: true,
            },
            beforeEnter: (to, from) => {
              if (!from.name) {
                return { name: 'appointmentBookingQuery' };
              }
            },
          },
        ],
      },
      {
        path: 'ongoing',
        name: 'appointmentOngoing',
        // component: () => import('@/views/appointment/currentQuery/IndexView.vue'),
        redirect: { name: 'appointmentOngoingQuery' },
        meta: {
          label: '查詢預約',
          requiredAuth: true,
        },
        children: [
          {
            path: 'query',
            name: 'appointmentOngoingQuery',
            component: () => import('@/views/appointment/ongoing/AppointmentOngoingQueryView.vue'),
            meta: {
              label: '查詢',
              requiredAuth: true,
            },
          },
          {
            path: 'rearrange',
            name: 'appointmentOngoingRearrange',
            component: () => import('@/views/appointment/ongoing/AppointmentOngoingRearrangeView.vue'),
            meta: {
              label: '預約改期',
              requiredAuth: true,
            },
            beforeEnter: () => {
              const router = useRouter();
              const appointmentStore = useAppointmentStore();
              if (!appointmentStore.targetClientScheduleNotStarted) {
                router.push({ name: 'appointmentOngoingQuery' });
              }
            },
          },
        ],
      },
      {
        path: 'history',
        name: 'appointmentHistoryQuery',
        component: () => import('@/views/appointment/history/AppointmentHistoryQueryView.vue'),
        meta: {
          label: '查詢紀錄',
          requiredAuth: true,
        },
      },
    ],
  },
];
