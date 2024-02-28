import { z } from 'zod';
import { api } from '@/utils/api';

export interface LoginRes {
  token: string;
};
export interface UserInfoRes {
  id: string;
  username: string;
  email: string;
};
export type BasicLoginReq = z.infer<typeof basicLoginSchema>;
export interface GoogleLoginReq {
  code: string;
}

export const basicLoginSchema = z.object({
  account: z.string().email('請輸入正確格式的email'),
  password: z.string().min(6),
});

export async function basicLogin(payload: BasicLoginReq) {
  const { data } = await api.post<LoginRes, BasicLoginReq>('user/basic-login', payload);
  return data.token;
}

export async function getUserInfo() {
  const { data } = await api.get<UserInfoRes>('user/info');
  return data;
}

export async function googleLogin(payload: GoogleLoginReq) {
  const { data } = await api.post<LoginRes, GoogleLoginReq>('user/google-login', payload);
  return data;
}
