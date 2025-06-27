import type { Update } from 'vite/types/hmrPayload.js';
import type { Space } from './user';
import { api } from '@/utils/api';

export interface CoachBonus {
  coachUserId: number;
  spaceId: number;
  yearMonth: string;
  personalQuarterlyBonus: number;
  groupQuarterlyBonus: number;
  rankQuarterlyBonus: number;
  user: {
    id: number;
    name: string;
  };
  space: Space;
}

export interface UpdateCoachBonusParam {
  spaceId: number;
  yearMonth: string;
  coachQuarterlyBonuses: {
    coachUserId: number;
    personalQuarterlyBonus: number;
    groupQuarterlyBonus: number;
    rankQuarterlyBonus: number;
  }[];
}

// 取得單一場館所有教練季度獎金
export async function getCoachQuarterlyBonus(params: { yearMonth: string; spaceId: number }) {
  const { data } = await api.get<CoachBonus[]>('/coachQuarterlyBonus', { params });
  return data;
}

// 更新單一場館教練季度獎金
export async function updateCoachQuarterlyBonus(payload: UpdateCoachBonusParam) {
  await api.post('coachQuarterlyBonus', payload);
}
