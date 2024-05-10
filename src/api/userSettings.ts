import { api } from '@/utils/api';
import { z } from 'zod';
import { upload2awsS3 } from './common';

interface Space {
  id: number;
  name: string;
  type: number;
}

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  weightForOrder: z.number(),
  description: z.string(),
  roleId: z.number(),
  spaceIds: z.number().array(),
  avatar: z.string().nullish(),
});
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = Required<CreateUser>;

export interface UploadInfo {
  method: string;
  url: string;
  maxFileSizeInMB: number;
  fileName: string;
}

export async function fetchSpaces() {
  const { data } = await api.get<Space[]>('spaces');
  return data;
}

export async function createUser(payload: CreateUser) {
  const { data } = await api.post<any, CreateUser>('users', payload);
  return data;
}

export async function updateUser(userId: number, payload: UpdateUser) {
  const { data } = await api.put<any, UpdateUser>(`users/${userId}`, payload);
  return data;
}

export async function getAvatarS3Info(userId: number) {
  const { data } = await api.get<UploadInfo>(`users/${userId}/avatar/write-url`);
  return data;
}

export async function uploadAvatar(userId: number, file: File) {
  const { url, fileName } = await getAvatarS3Info(userId);
  await upload2awsS3(url, file);
  return fileName;
}

export async function suspendUser(userId: number, isSuspended: boolean) {
  const { data } = await api.patch(`users/${userId}/suspend`, { isSuspended });
  return data;
}
