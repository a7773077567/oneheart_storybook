import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useAppointmentStore, useUserStore } from '@/stores';
import { loginRoutes } from './login';
import { homeRoutes } from './home';
import { appointmentRoutes } from './appointment';

export const routes: RouteRecordRaw[] = [
  ...loginRoutes,
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/Layout.vue'),
    redirect: { name: 'home' },
    meta: {
      requiredAuth: true,
    },
    children: [
      ...homeRoutes,
      ...appointmentRoutes,
      {
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
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('@/views/store/Store.vue'),
        meta: {
          label: '商城',
          requiredAuth: true,
          permission: false,
        },
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/Order.vue'),
        meta: {
          label: '交易管理',
          requiredAuth: true,
          permission: true,
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
      {
        path: '/shift',
        name: 'shift',
        redirect: { name: 'shiftList' },
        meta: {
          label: '排班',
          requiredAuth: true,
          permission: true,
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
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/UserView.vue'),
        redirect: { name: 'userList' },
        meta: {
          label: '人員設定',
          requiredAuth: true,
          permission: false,
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
      {
        path: '/gym',
        name: 'gym',
        component: () => import('@/views/gym/Gym.vue'),
        meta: {
          label: '場館管理',
          requiredAuth: true,
          permission: false,
        },
      },

    ],
  },
  {
    path: '/receipt-print',
    name: 'receiptPrint',
    component: () => import('@/views/print/ReceiptPrintView.vue'),
  },
  {
    path: '/sign-success',
    name: 'TransactionSignSuccess',
    component: () => import('@/views/order/TransactionSignSuccess.vue'),
    meta: {
      requiredAuth: false,
      hide: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const needAuth = to.meta.requiredAuth;
  if (!needAuth) {
    return;
  }

  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { name: 'userLogin' };
  }

  return true;
});

async function checkAuth() {
  const userStore = useUserStore();
  try {
    await userStore.getUserInfo();
    return true;
  }
  catch {
    return false;
  }
}

export default router;
