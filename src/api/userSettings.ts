import { api } from '@/utils/api';
import { z } from 'zod';

interface Space {
  id: number;
  name: string;
  type: number;
}

// export interface UsersPost {
//   name: string;
//   email: string;
//   weightForOrder: number;
//   description: string;
//   roleId: number;
//   spaceIds: number[];
// }

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  weightForOrder: z.number(),
  description: z.string().optional(),
  roleId: z.number(),
  spaceIds: z.number().array(),
});
export type CreateUserPost = z.infer<typeof createUserSchema>;

export async function fetchSpaces() {
  const { data } = await api.get<Space[]>('spaces');
  return data;
}

export async function createUser(payload: CreateUserPost) {
  const { data } = await api.post<any, CreateUserPost>('users', payload);
  return data;
}
