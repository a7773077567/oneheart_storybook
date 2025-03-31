import type { RouteRecordRaw } from 'vue-router';

export const shiftRoutes: RouteRecordRaw[] = [
  {
    path: '/shift',
    name: 'shift',
    redirect: { name: 'shiftList' },
    meta: {
      label: '排班',
      requiredAuth: true,
      icon: 'event_note',
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
        path: 'group-template',
        name: 'groupShiftTemplate',
        component: () => import('@/views/shift/GroupTemplate.vue'),
        meta: {
          label: '新增團課',
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
];
