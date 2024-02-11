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

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
type LoginData = z.infer<typeof LoginSchema>;

export async function login(payload: LoginData) {
  const { data } = await api.post<LoginRes, LoginData>('user/login', payload);
  return data.token;
}
