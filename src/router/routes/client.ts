import type { RouteRecordRaw } from 'vue-router';

export const clientRoutes: RouteRecordRaw[] = [{
  path: '/client',
  name: 'client',
  component: () => import('@/views/client/Client.vue'),
  meta: {
    label: '客戶管理',
    requiredAuth: true,
    permission: true,
  },
  redirect: { name: 'clientList' },
  children: [
    {
      path: 'list',
      name: 'clientList',
      component: () => import('@/views/client/ClientList.vue'),
      meta: {
        label: '客戶總表',
        requiredAuth: true,
      },
      children: [
        {
          path: 'info/:clientId',
          name: 'clientInfo',
          component: () => import('@/views/client/ClientInfo.vue'),
          props: true,
          meta: {
            customLabel: true,
            label: '客戶編號',
            requiredAuth: true,
            notShownInSidebar: true,
          },
          beforeEnter: (to) => {
            to.meta.label = `客戶編號 - ${to.params.clientId}`;
            return true;
          },
        },
      ],
    },
    {
      path: 'add',
      name: 'clientAdding',
      component: () => import('@/views/client/ClientAdd.vue'),
      meta: {
        label: '新增客戶',
        requiredAuth: true,
      },
    },
  ],
}];
