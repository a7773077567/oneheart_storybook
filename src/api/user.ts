import { z } from 'zod';
import { api } from '@/utils/api';
import { useUserStore } from '@/stores';
import type { SpaceType } from '@/const/general';

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
};

export interface Role {
  id: number;
  name: string;
  type: RoleType;
}

export enum AccountState {
  未開通 = 1,
  開通 = 2,
}

export enum WorkState {
  在職 = 1,
  停權 = 2,
  離職 = 3,
}

export enum RoleType {
  系統管理者 = 1,
  院長 = 2,
  副院長 = 3,
  物理治療師組長 = 4,
  物理治療師 = 5,
  店長 = 6,
  副店長 = 7,
  教練組長 = 8,
  教練 = 9,
  櫃檯 = 10,
}

export enum PTLevel {
  'PT1' = 1,
  'PT2' = 2,
  'PT3' = 3,
  'PT4' = 4,
  'PT5' = 5,
  'PT副院長' = 6,
  'PT院長' = 7,
}
export interface User {
  avatarUrl: string | null;
  ancestor: User | null;
  description: string;
  email: string;
  hireDate: string;
  id: number;
  introducer: User | null;
  jobClass: number;
  name: string;
  PTLevel: PTLevel;
  role: Role;
  spaces: Space[];
  state: AccountState;
  stateOfWork: WorkState;
  type: RoleType; // can be removed?
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
  type: SpaceType;
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

export async function fetchUsers(query: { spaceIds?: number[]; roleTypes?: RoleType[] }) {
  const { data } = await api.get<User[]>('users', { params: query });
  return data;
}

export async function fetchUser(userId: number) {
  const { data } = await api.get<User>(`users/${userId}`);
  return data;
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

export async function resignUser(userId: number, isResigned: boolean) {
  await api.patch(`users/${userId}/resign`, { isResigned });
}
