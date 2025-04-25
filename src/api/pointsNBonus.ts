import { api } from '@/utils/api';
import type { User } from './user';
import type { PagingMeta } from '@/types/common';

/** 外派獎金 */
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

/** 寫作津貼 */
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
// 單一寫作津貼
export async function getWritingAllowance(id: number) {
  const { data } = await api.get<WritingAllowance>(`writingAllowances/${id}`);
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

/** 培訓津貼 */
export interface TrainingAllowance {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
}

export interface NewTrainingAllowance {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
}
// 單一培訓津貼
export async function getTrainingAllowance(id: number) {
  const { data } = await api.get<TrainingAllowance>(`trainingAllowances/${id}`);
  return data;
};

// 培訓津貼列表
interface BonusQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
}
export async function getTrainingAllowanceList(params: BonusQuery) {
  const { data, meta } = await api.get<TrainingAllowance[], PagingMeta>(`trainingAllowances`, { params });
  return { data, meta };
};

// 建立培訓津貼
export async function createTrainingAllowance(payload: NewTrainingAllowance) {
  await api.post('trainingAllowances', payload);
}

// 更新培訓津貼
export async function updateTrainingAllowance(id: number, payload: NewRelocationBonus) {
  const { data } = await api.patch(`trainingAllowances/${id}`, payload);
  return data;
}

// 刪除培訓津貼
export async function deleteTrainingAllowance(id: number) {
  await api.delete(`trainingAllowances/${id}`);
}
