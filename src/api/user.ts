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
export interface GoogleLoginReq {
  code: string;
}
export interface MicrosoftLoginReq {
  idToken: string;
}

export const basicLoginSchema = z.object({
  account: z.string().email('請輸入正確格式的email'),
  password: z.string().min(6),
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
