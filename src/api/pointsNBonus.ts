import { api } from '@/utils/api';
import type { User } from './user';
import type { PagingMeta } from '@/types/common';

export interface RelocationBonus {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
}

export interface NewRelocationBonus {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
}

// 單一外派獎金
export async function getExpatAllowance(id: number) {
  const { data } = await api.get<RelocationBonus>(`expatAllowances/${id}`);
  return data;
};

// 外派獎金列表
interface BonusQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
}
export async function getExpatAllowanceList(params: BonusQuery) {
  const { data, meta } = await api.get<RelocationBonus[], PagingMeta>(`expatAllowances`, { params });
  return { data, meta };
};

// 建立外派獎金
export async function createExpatAllowance(payload: NewRelocationBonus) {
  await api.post('expatAllowances', payload);
}

// 更新外派獎金
export async function updateExpatAllowance(id: number, payload: NewRelocationBonus) {
  const { data } = await api.patch(`expatAllowances/${id}`, payload);
  return data;
}

// 刪除外派獎金
export async function deleteExpatAllowance(id: number) {
  await api.delete(`expatAllowances/${id}`);
}

export interface WritingAllowance {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
}

export interface NewWritingAllowance {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
}

/** 寫作津貼 */
// 單一寫作津貼
export async function getWritingAllowance(id: number) {
  const { data } = await api.get<RelocationBonus>(`writingAllowances/${id}`);
  return data;
};

// 寫作津貼列表
interface BonusQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
}
export async function getWritingAllowanceList(params: BonusQuery) {
  const { data, meta } = await api.get<WritingAllowance[], PagingMeta>(`writingAllowances`, { params });
  return { data, meta };
};

// 建立寫作津貼
export async function createWritingAllowance(payload: NewWritingAllowance) {
  await api.post('writingAllowances', payload);
}

// 更新寫作津貼
export async function updateWritingAllowance(id: number, payload: NewRelocationBonus) {
  const { data } = await api.patch(`writingAllowances/${id}`, payload);
  return data;
}

// 刪除寫作津貼
export async function deleteWritingAllowance(id: number) {
  await api.delete(`writingAllowances/${id}`);
}
