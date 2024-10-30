import { api } from '@/utils/api';
import { z } from 'zod';
import { upload2awsS3 } from './upload';
import { RoleType } from './user';

interface Space {
  id: number;
  name: string;
  type: number;
}

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email('請輸入正確格式的email'),
  weightForOrder: z.number(),
  description: z.string(),
  roleId: z.number(),
  spaceIds: z.number().array(),
  avatar: z.string().nullish(),
  jobClass: z.number().nullish(),
})
  .refine((data) => {
    // 初診等級只有在帳號職位是「治療師、院長、副院長」時會出現（必填）
    if (data.roleId === RoleType['物理治療師'] || data.roleId === RoleType['院長'] || data.roleId === RoleType['副院長']) {
      return !!data.jobClass;
    }
    return true;
  }, {
    message: '初診等級必填',
    path: ['jobClass'], // path of error
  });

export type CreateUser = z.infer<typeof createUserSchema>;
// export type UpdateUser = Required<CreateUser>;
export type UpdateUser = CreateUser;

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
