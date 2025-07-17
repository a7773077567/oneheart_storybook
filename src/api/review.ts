import type { User } from './user';
import { api } from '@/utils/api';
import type { PageQuery, PagingMeta } from '@/types/common';

export interface Review {
  id: number;
  type: ReviewTypes;
  title: string;
  amount: number;
  point: number;
  status: ReviewState;
  applicantUser: User;
  reviewDateTime: string;
  attachmentUrl: string;
}

export type ReviewTypes =
  | 'TrainingAllowances'
  | 'WritingAllowances'
  | 'ExpatAllowances'
  | 'EducationPoints'
  | 'GoogleReviews'
  | 'SupportBonuses'
  | 'OtherBonuses';

export enum ReviewState {
  待審核 = 1,
  已批准 = 2,
  已駁回 = 3,
}

// 取得待審核紀錄
export async function getReivewNonapproveList(params: Partial<PageQuery & { userId?: number }> = {}) {
  const { data, meta } = await api.get<Review[], PagingMeta>('performance-and-bonus-review/non-approved', { params });
  return { data, meta };
}

// 批准申請
export async function approveReview(payload: { id: number; type: ReviewTypes }) {
  await api.patch(`performance-and-bonus-review/approve`, payload);
}

// 駁回申請
export async function rejectReview(payload: { id: number; type: ReviewTypes }) {
  await api.patch(`performance-and-bonus-review/approve`, payload);
}
