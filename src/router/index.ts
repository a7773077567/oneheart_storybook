import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useHandoverStore, useUserStore } from '@/stores';
import { appointmentRoutes, cashDropHandoverRoutes, clientRoutes, gymRoutes, homeRoutes, loginRoutes, orderRoutes, printRoutes, reportRoutes, shiftRoutes, storeRoutes, userRoutes } from './routes';

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
      ...shiftRoutes,
      ...cashDropHandoverRoutes,
      ...reportRoutes,
      ...clientRoutes,
      ...orderRoutes,
      ...userRoutes,
      // ...gymRoutes,
      // ...storeRoutes,
    ],
  },
  ...printRoutes,
  {
    path: '/sign-success',
    name: 'ContractSignSuccess',
    component: () => import('@/views/contract/ContractSignSuccess.vue'),
    meta: {
      requiredAuth: false,
      hide: true,
    },
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('@/views/login/UserLoginView.vue') },
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

  const userStore = useUserStore();

  if (to.name !== 'spaceLogin' && userStore.canI('READ_HANDOVER')) {
    const handoverStore = useHandoverStore();
    handoverStore.getShiftChangeReminder();
  }
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
