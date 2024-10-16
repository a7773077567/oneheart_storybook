import { useUserStore } from '@/stores';
import type { RouteRecordRaw } from 'vue-router';

export const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/user-login',
    name: 'userLogin',
    component: () => import('@/views/login/UserLoginView.vue'),
    beforeEnter: loginGuard,
  },
  {
    path: '/space-login',
    name: 'spaceLogin',
    component: () => import('@/views/login/SpaceLoginView.vue'),
    meta: {
      requiredAuth: true,
    },
  },
  {
    path: '/resend-activation-email',
    name: 'resendActivationEmail',
    component: () => import('@/views/login/ResendActivationEmailView.vue'),
    meta: {
      requiredAuth: true,
    },
  },
  {
    path: '/activate-user',
    name: 'activateUser',
    component: () => import('@/views/login/ActivateUser.vue'),
    meta: {
      requiredAuth: false,
    },
  },
  {
    path: '/resend-forgot-password-email',
    name: 'resendForgotPasswordEmail',
    component: () => import('@/views/login/ResendForgotPasswordEmailView.vue'),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('@/views/login/ResetPassword.vue'),
    meta: {
      requireAuth: false,
    },
    props: route => ({ token: route.query.token }),
  },
];

async function loginGuard() {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    return { name: 'home' };
  }
}

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
