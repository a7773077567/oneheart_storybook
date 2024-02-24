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

export interface LoginRes {
  token: string;
};

export interface UserInfoRes {
  id: string;
  username: string;
  email: string;
};

export type LoginReq = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  account: z.string().email('請輸入正確格式的email'),
  password: z.string().min(6),
});

export async function login(payload: LoginReq) {
  const { data } = await api.post<LoginRes, LoginReq>('user/login', payload);
  return data.token;
}

export async function getUserInfo() {
  const { data } = await api.get<UserInfoRes>('user/info');
  return data;
}
