import { api } from '@/utils/api';
import type { User } from './user';
import type { PagingMeta, S3UploadInfo } from '@/types/common';
import type { ReviewState } from './review';

interface ReviewResult {
  approvedAt: null | string;
  approvedBy: null | string;
  approver: null | User;
  status: ReviewState;
}

/** 外派獎金 */
export interface RelocationBonus extends ReviewResult {
  amount: number;
  attachmentUrl: string;
  id: number;
  reviewDateTime: string;
  title: string;
  user: User;
};
export interface NewRelocationBonus {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  attachment: string;
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

// 取得外派獎金上傳 url
export async function getExpatAllowanceUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`expatAllowances/${userId}/attachment/write-url`);
  return data;
}

/** 寫作津貼 */
export interface WritingAllowance extends ReviewResult {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
  attachmentUrl: string;
}

export interface NewWritingAllowance {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  attachment: string;
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

// 取得寫作津貼上傳 url
export async function getWritingAllowanceUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`writingAllowances/${userId}/attachment/write-url`);
  return data;
}

/** 培訓津貼 */
export interface TrainingAllowance extends ReviewResult {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
  attachmentUrl: string;
}

export interface NewTrainingAllowance {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  attachment: string;
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

// 取得培訓津貼上傳 url
export async function getTrainingAllowanceUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`trainingAllowances/${userId}/attachment/write-url`);
  return data;
}

/** 支援獎金 */
export interface SupportBonus extends ReviewResult {
  id: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  user: User;
  attachmentUrl: string;
}

export interface NewSupportBonus {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  attachment: string;
}
// 單一支援獎金
export async function getSupportBonus(id: number) {
  const { data } = await api.get<SupportBonus>(`supportBonuses/${id}`);
  return data;
};

// 支援獎金列表
interface BonusQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
}
export async function getSupportBonusList(params: BonusQuery) {
  const { data, meta } = await api.get<SupportBonus[], PagingMeta>(`supportBonuses`, { params });
  return { data, meta };
};

// 建立支援獎金
export async function createSupportBonus(payload: NewSupportBonus) {
  await api.post('supportBonuses', payload);
}

// 更新支援獎金
export async function updateSupportBonus(id: number, payload: NewRelocationBonus) {
  const { data } = await api.patch(`supportBonuses/${id}`, payload);
  return data;
}

// 刪除支援獎金
export async function deleteSupportBonus(id: number) {
  await api.delete(`supportBonuses/${id}`);
}

// 取得支援獎金上傳 url
export async function getSupportBonusUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`supportBonuses/${userId}/attachment/write-url`);
  return data;
}

/** 其他津貼(其他獎金) */
export interface OtherAllowance extends ReviewResult {
  amount: number;
  attachmentUrl: string;
  id: number;
  reviewDateTime: string;
  title: string;
  user: User;
};
export interface NewOtherAllowance {
  userId: number;
  title: string;
  amount: number;
  reviewDateTime: string;
  attachment: string;
}

// 單一其他津貼
export async function getOtherAllowance(id: number) {
  const { data } = await api.get<OtherAllowance>(`otherBonuses/${id}`);
  return data;
};

// 其他津貼列表
interface BonusQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
}
export async function getOtherAllowanceList(params: BonusQuery) {
  const { data, meta } = await api.get<OtherAllowance[], PagingMeta>(`otherBonuses`, { params });
  return { data, meta };
};

// 建立其他津貼
export async function createOtherAllowance(payload: NewOtherAllowance) {
  await api.post('otherBonuses', payload);
}

// 更新其他津貼
export async function updateOtherAllowance(id: number, payload: NewOtherAllowance) {
  const { data } = await api.patch(`otherBonuses/${id}`, payload);
  return data;
}

// 刪除其他津貼
export async function deleteOtherAllowance(id: number) {
  await api.delete(`otherBonuses/${id}`);
}

// 取得其他津貼上傳 url
export async function getOtherAllowanceUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`otherBonuses/${userId}/attachment/write-url`);
  return data;
}
