import { z } from 'zod';
import { api } from '@/utils/api';

export interface LoginRes {
  accessToken: string;
};
export interface Location {
  id: number;
  type: 'clinic' | 'gym';
  name: string;
}

export interface Role {
  id: number;
  name: string;
  type: number;
}
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
  spaces: Space[];
  avatar?: string;
};
export type BasicLoginReq = z.infer<typeof basicLoginSchema>;
export type ForgotReq = z.infer<typeof emailSchema>;
export interface NewPasswordReq {
  userId: string;
  password: string;
  confirm: string;
}
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
  confirm: z.string().min(6),
}).refine(data => data.confirm === data.password, {
  message: '密碼須一致',
  path: ['confirm'],
});

export interface Space {
  id: number;
  name: string;
}

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
  const { data } = await api.post<SuccessRes, ForgotReq>('users/forgot-password', payload);
  return data;
}

export async function setNewPassword(payload: NewPasswordReq) {
  const { data } = await api.post<SuccessRes, NewPasswordReq>('user/new-password', payload);
  return data;
}

export async function fetchUserInfo() {
  const { data } = await api.get<UserInfo>('users/me');
  return data;
}

export async function spaceLogin(payload: SpaceLoginReq) {
  const { data } = await api.post<LoginRes, SpaceLoginReq>('spaces/login', payload);
  return data;
}
