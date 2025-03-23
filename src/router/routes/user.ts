import type { RouteRecordRaw } from 'vue-router';

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/UserView.vue'),
    redirect: { name: 'userList' },
    meta: {
      label: '人員設定',
      requiredAuth: true,
      permissions: ['VIEW_USER_SETTING'],
      icon: 'o_manage_accounts',
    },
    children: [
      {
        path: 'list',
        name: 'userList',
        component: () => import('@/views/user/ListView.vue'),
        children: [
          {
            path: 'edit',
            name: 'userEdition',
            component: () => import('@/views/user/EditView.vue'),
            props: route => ({ userId: route.query.userId }),
            meta: {
              label: '編輯',
              requiredAuth: true,
              notShownInSidebar: true,
            },
          },
        ],
        meta: {
          label: '人員總表',
          requiredAuth: true,
        },
      },
      {
        path: 'add',
        name: 'userAdding',
        component: () => import('@/views/user/AddView.vue'),
        meta: {
          label: '人員新增',
          requiredAuth: true,
        },
      },
      // {
      //   path: 'list/edit',
      //   name: 'userEdition',
      //   component: () => import('@/views/user/EditView.vue'),
      //   meta: {
      //     label: '編輯',
      //     requiredAuth: true,
      //     notShownInSidebar: true,
      //   },
      // },
    ],
  },
];
