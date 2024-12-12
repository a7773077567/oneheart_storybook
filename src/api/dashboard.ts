import { api } from '@/utils/api';
import type { PagingMeta } from '@/types/common';
import type { Client } from './clientManagement';
import type { HistoryRecord } from './appointment';

export type CoachStatisticsDateRange = 'today' | 'month';

interface Query {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId?: number;
  dateRange: CoachStatisticsDateRange;
}

// 取得教練現況概覽
export interface CoachStatistics {
  totalAppointments: number;
  paidOrders: number;
  totalAmount: number;
  allPaymentStatistic: { label: string; value: number }[];
}
export async function getCoachStatistics(query: Query) {
  const { data } = await api.get<CoachStatistics>(`dashboard/coachClientScheduleStatics`, { params: query });
  return data;
}

// 取得教練進行中排程
export interface CoachAppointment {
  id: number;
  client: Client;
  clientId: number;
  date: string;
  userShiftId: number;
  userShiftAppointmentId: number;
  record: HistoryRecord;
  remainingTotalCoachClassPoints: number;
}
export async function getCoachAppointmentList(query: Query) {
  const { data, meta } = await api.get<CoachAppointment[], PagingMeta>(`dashboard/coachAppointmentList`, { params: query });
  return { data, meta };
}

// 取得教練運營目標
export interface CoachOperationGoal {
  user: {
    id: number;
    name: string;
  };
  quarter: number;
  currentOrder: number;
  targetOrder: number;

}
export async function getCoachOperationGoal(userId?: number) {
  const { data } = await api.get<CoachOperationGoal[]>(`dashboard/coachOperatingObjective`, { params: { ...(userId && { userId }) } });
  return data;
}

// 更新教練運營目標
export interface NewGoal {
  userId: number;
  quarter: number;
  targetCount: number;

}
export async function updateCoachOperationGoal(params: NewGoal) {
  await api.post(`dashboard/coachOperatingObjective`, params);
}
