import { api } from '@/utils/api';
import type { User } from '../user';
import type { PageQuery, PagingMeta, S3UploadInfo } from '@/types/common';

export interface EducationPointContent {
  id: number;
  title: string;
  reviewDateTime: string;
  user: User;
  point: number;
  attachmentUrl: string;
}

export interface EducationPoint {
  userId: number;
  title: string;
  reviewDateTime: string;
  point: number;
  attachment: string;
}

export async function getEducationPointList(params: { userId?: number } & PageQuery) {
  const { data, meta } = await api.get<EducationPointContent[], PagingMeta >('educationPoints', { params });
  return { data, meta };
}
export async function getAEducationPoint({ id }: { id: number }) {
  const { data } = await api.get<EducationPointContent>(`educationPoints/${id}`);
  return data;
}

export async function createEducationPoints(payload: EducationPoint) {
  const { data } = await api.post('educationPoints', payload);
  return data;
}

export async function updateEducationPoint({ id }: { id: number }, payload: EducationPoint) {
  const { data } = await api.patch<EducationPoint>(`educationPoints/${id}`, payload);
  return data;
}

export async function deleteEducationPoint({ id }: { id: number }) {
  const { data } = await api.delete(`educationPoints/${id}`);
  return data;
}

// 取得教育積分上傳 url
export async function getEducationUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`educationPoints/${userId}/attachment/write-url`);
  return data;
}
