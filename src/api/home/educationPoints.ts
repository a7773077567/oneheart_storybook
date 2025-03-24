import { api } from '@/utils/api';
import type { User } from '../user';
import type { PageQuery, PagingMeta } from '@/types/common';

export interface EducationPointContent {
  id: number;
  title: string;
  reviewDateTime: string;
  user: User;
  point: number;
}

export interface EducationPoint {
  userId: number;
  title: string;
  reviewDateTime: string;
  point: number;
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
