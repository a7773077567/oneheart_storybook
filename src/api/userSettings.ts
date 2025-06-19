import { api } from '@/utils/api';

import { upload2awsS3 } from './upload';
import type { RoleType, User } from './user';

interface Space {
  id: number;
  name: string;
  type: number;
}

export interface CreateUser extends Pick<User, 'name' | 'email' | 'weightForOrder' | 'description' | 'hireDate' | 'baseSalary'> {
  roleId: RoleType;
  spaceIds: number[];
  jobClass?: number | null;
  PTLevel?: number | null;
  onBoardDate: string;
  introducerUserId: number | null;
  ancestorUserId: number | null;
  isPartTime?: boolean;
}

export interface UpdateUser extends CreateUser {
  avatar?: null | string;
}

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
  const { url, fileName, maxFileSizeInMB } = await getAvatarS3Info(userId);
  await upload2awsS3(url, file, maxFileSizeInMB);
  return fileName;
}

export async function suspendUser(userId: number, isSuspended: boolean) {
  const { data } = await api.patch(`users/${userId}/suspend`, { isSuspended });
  return data;
}
