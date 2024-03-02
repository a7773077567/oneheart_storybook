import { z } from 'zod';
import { api } from '@/utils/api';

export interface LoginRes {
  token: string;
};
export interface Location {
  id: number;
  type: 'clinic' | 'gym';
  name: string;
}
export interface UserInfoRes {
  id: string;
  username: string;
  email: string;
  avatar: string;
  locations: Location[];
};
export type BasicLoginReq = z.infer<typeof basicLoginSchema>;
export type ForgetReq = z.infer<typeof accountSchema>;
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

export const accountSchema = z.object({
  account: z.string().email('請輸入正確格式的email'),
});

export const basicLoginSchema = accountSchema.extend({
  password: z.string().min(6),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6),
  confirm: z.string().min(6),
}).refine(data => data.confirm === data.password, {
  message: '密碼須一致',
  path: ['confirm'],
});

export async function basicLogin(payload: BasicLoginReq) {
  const { data } = await api.post<LoginRes, BasicLoginReq>('user/basic-login', payload);
  return data;
}

export async function getUserInfo() {
  const { data } = await api.get<UserInfoRes>('user/info');
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

export async function forgetPassword(payload: ForgetReq) {
  const { data } = await api.post<SuccessRes, ForgetReq>('user/forget', payload);
  return data;
}

export async function setNewPassword(payload: NewPasswordReq) {
  const { data } = await api.post<SuccessRes, NewPasswordReq>('user/new-password', payload);
  return data;
}
