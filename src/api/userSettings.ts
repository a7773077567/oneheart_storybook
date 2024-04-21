import { api } from '@/utils/api';

interface Space {
  id: number;
  name: string;
  type: number;
}

export interface UsersPost {
  name: string;
  email: string;
  weightForOrder: number;
  description: string;
  roleId: number;
  spaceIds: number[];
}

export async function fetchSpaces() {
  const { data } = await api.get<Space[]>('spaces');
  return data;
}

export async function createUser(payload: UsersPost) {
  const { data } = await api.post<any, UsersPost>('users', payload);
  return data;
}
