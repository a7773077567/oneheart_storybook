import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';
import { appointmentRoutes, clientRoutes, gymRoutes, homeRoutes, loginRoutes, orderRoutes, printRoutes, shiftRoutes, storeRoutes, userRoutes } from './routes';

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
      ...clientRoutes,
      ...storeRoutes,
      ...orderRoutes,
      ...shiftRoutes,
      ...userRoutes,
      ...gymRoutes,
    ],
  },
  ...printRoutes,
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
