import { z } from 'zod';
import { api } from '@/utils/api';
import { useUserStore } from '@/stores';

export interface LoginRes {
  accessToken: string;
};

export interface Role {
  id: number;
  name: string;
  type: number;
}
export interface User {
  id: number;
  name: string;
  email: string;
  state: 1 | 2;
  isSuspended: boolean;
  role: Role;
  spaces: Space[];
  description: string;
  avatarUrl: string | null;
  weightForOrder: number;
};
export type BasicLoginReq = z.infer<typeof basicLoginSchema>;
export type ForgotReq = z.infer<typeof emailSchema>;
export type NewPasswordReq = z.infer<typeof newPasswordSchema>;
export interface GoogleLoginReq {
  code: string;
}
export interface MicrosoftLoginReq {
  idToken: string;
}

export interface SpaceLoginReq {
  spaceId: number;
}

export const emailSchema = z.object({
  email: z.string().email('請輸入正確格式的email'),
});

export const basicLoginSchema = emailSchema.extend({
  password: z.string().min(6),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.confirmPassword === data.password, {
  message: '密碼須一致',
  path: ['confirmPassword'],
});

export interface Space {
  id: number;
  name: string;
  type: number;
}

// ========== Requests ==========
export async function basicLogin(payload: BasicLoginReq) {
  const { data } = await api.post<LoginRes, BasicLoginReq>('users/login', payload);
  return data;
}

export async function googleLogin(payload: GoogleLoginReq) {
  const { data } = await api.post<LoginRes, GoogleLoginReq>('user/google-login', payload);
  return data;
}

export async function microsoftLogin(payload: MicrosoftLoginReq) {
  const { data } = await api.post<LoginRes, MicrosoftLoginReq>('user/microsoft-login', payload);
  return data;
}

export async function forgotPassword(payload: ForgotReq) {
  const { data } = await api.post<any, ForgotReq>('users/forgot-password', payload);
  return data;
}

export async function resetPassword(payload: NewPasswordReq) {
  const { data } = await api.post<any, NewPasswordReq>('users/reset-password', payload);
  return data;
}

export async function fetchUsers(spaceIds: number[]) {
  const { data } = await api.get<User[]>('users', { params: { spaceIds } });
  return data;
}

export async function fetchUser(userId: number) {
  // const {data} = await api.get<User>(`users/${userId}`)
  // return data

  const userStore = useUserStore();
  return userStore.users.find(user => user.id === userId)!;
}

export async function fetchUserInfo() {
  const { data } = await api.get<User>('users/me');
  return data;
}

export async function spaceLogin(payload: SpaceLoginReq) {
  const { data } = await api.post<LoginRes, SpaceLoginReq>('spaces/login', payload);
  return data;
}

export async function activateUser(payload: NewPasswordReq) {
  const { data } = await api.post<any, NewPasswordReq>('users/activate', payload);
  return data;
}

export async function resendActivateEmail(userId: number) {
  const { data } = await api.post(`users/${userId}/resend-activation-email`);
  return data;
}

export async function updatePassword(payload: { password: string }) {
  const { data } = await api.post(`users/update-password`, payload);
  return data;
}
