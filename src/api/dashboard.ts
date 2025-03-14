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
export async function getCoachOperationGoal(userId?: number | undefined) {
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

// 取得治療師紅綠燈
interface IndicatorPoint {
  predictionPoint: number;
  currentPoint: number;
  totalPoint: number;
}

interface SignalRange {
  light: 'red' | 'yellow' | 'green';
  min: number;
  max: number | null;
}

export interface TrafficLightStatistic {
  isWorkOverThreeMonth: boolean; // 判斷是否到職3個月
  predictionPoint: number;
  currentPoint: number;
  rules: SignalRange[];
  executionCount: IndicatorPoint; // 執行數
  returnVisitRate: IndicatorPoint; // 回診率
  presonalRevenue: IndicatorPoint; // 個人營業額
  referralCount: IndicatorPoint; // 轉介數
  educationPoint: IndicatorPoint; // 教育積分
  googleCommentCount: IndicatorPoint; // Google評論數
}
export async function getTherapistTrafficLight(params: { userId: number }) {
  const { data } = await api.get<TrafficLightStatistic>(`dashboard/therapistTrafficlight`, { params });
  return data;
}

export interface ReferralOverview {
  predictionPoint: number;
  currentPoint: number;
  currentPTLevel: number;
  rules: {
    score: number;
    min: number;
    max: number | null;
  }[];
  detailList: {
    year: number;
    month: number;
    referralCount: number;
  }[];
}
// 取得治療師紅綠燈指標-轉介數｜計分詳情與資料-概覽
export async function getReferralStatsOverview(params: { userId: number }) {
  const { data } = await api.get<ReferralOverview>(`dashboard/therapistTrafficlight-referralStatistics-overview`, { params });
  return data;
}

export interface ReferralDetail {
  clientId: number;
  clientName: string;
  userShiftType: number;
  referralClientName: string;
}
interface ReferralListQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  userId: number;
}
// 取得治療師紅綠燈指標-轉介數｜計分詳情與資料-列表`
export async function getReferralStatsList(params: ReferralListQuery) {
  const { data, meta } = await api.get<ReferralDetail[], PagingMeta>(`dashboard/therapistTrafficlight-referralStatistics-list`, { params });
  return { data, meta };
}
