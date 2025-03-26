import { api } from '@/utils/api';
import type { PagingMeta } from '@/types/common';
import type { Client } from './clientManagement';
import type { AddOnService, HistoryRecord } from './appointment';
import type { ReservedMachine } from './machine';
import type { TransactionTypes } from '@/const/general';
import type { User } from './user';

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

export interface ScoreRule {
  score: number;
  min: number;
  max: number | null;
}

export interface ReferralOverview {
  predictionPoint: number;
  currentPoint: number;
  currentPTLevel: number;
  rules: ScoreRule[];
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

export interface ReturnVisitRateOverview {
  predictionPoint: number;
  currentPoint: number;
  currentPTLevel: number;
  rules: ScoreRule[];
  detailList: {
    year: number;
    month: number;
    returnVisitCount: number;
    firstScheduleCount: number;
    returnVisitRate: number;
    points: number;
  }[];
}

// 紅綠燈指標-回診率｜計分詳情與資料-概覽
export async function getReturnVisitRateStatsOverview(params: { userId: number }) {
  const { data } = await api.get<ReturnVisitRateOverview>(`dashboard/therapistTrafficlight-returnVisitRateStatistics-overview`, { params });
  return data;
}

export interface ReturnVisitRateDetail {
  clientId: number;
  clientName: string;
  clientPhoneNumber: string;
  isReturning: boolean;
}
// 紅綠燈指標-回診率｜計分詳情與資料-列表
export async function getReturnVisitRateStatsList(params: ReferralListQuery) {
  const { data, meta } = await api.get<ReturnVisitRateDetail[], PagingMeta>(`dashboard/therapistTrafficlight-returnVisitRateStatistics-list`, { params });
  return { data, meta };
}

// 紅綠燈指標-執行數｜計分詳情與資料-概覽
export interface ExecutionCountOverview {
  predictionPoint: number;
  currentPoint: number;
  currentPTLevel: number;
  rules: ScoreRule[];
  detailList: {
    year: number;
    month: number;
    executionCount: number;
    points: number;
  }[];
}
export async function getExecutionCountStatsOverview(params: { userId: number }) {
  const { data } = await api.get<ExecutionCountOverview>(`dashboard/therapistTrafficlight-executionCountStatistics-overview`, { params });
  return data;
}

// 紅綠燈指標-執行數｜計分詳情與資料-列表
export interface ExecutionCountDetail {
  id: number;
  client: Client;
  clientId: number;
  date: string;
  userShiftId: number;
  userShift: {
    id: number;
    spaceId: number;
    userId: number;
    user: {
      id: number;
      name: string;
      role: {
        id: number;
        name: string;
        type: number;
      };
    };
    type: number;
    name: string;
    maxClients: number;
    space: {
      id: number;
      name: string;
      type: number;
    };
  };
  userShiftAppointmentId: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
  bookedNumber: number;
  coachClassClients: Client[];
  note: string;
  machines: ReservedMachine[];
  paymentState: boolean;
  state: number;
  isEmployeePrice: boolean;
  isValidForRestore: boolean;
  isBeenRearranged: boolean;
  isRearrangedClientSchedule: boolean;
  rearrangeClientSchedule: null | unknown;
  isFirstClientSchedule: boolean;
  addOnServices: AddOnService[];
  isUsingAutoRecommend: boolean;
  isUserShiftDeleted: boolean;
  isHighSalesOpportunity: boolean;
  executionCount: number;
}
export async function getExecutionCountStatsList(params: ReferralListQuery) {
  const { data, meta } = await api.get<ExecutionCountDetail[], PagingMeta>(`dashboard/therapistTrafficlight-executionCountStatistics-list`, { params });
  return { data, meta };
}

// 紅綠燈指標-個人營業額｜計分詳情與資料-概覽
export interface PersonalRevenueOverview {
  predictionPoint: number;
  currentPoint: number;
  currentPTLevel: number;
  rules: ScoreRule[];
  detailList: {
    year: number;
    month: number;
    revenue: number;
    points: number;
  }[];
}
export async function getPersonalRevenueStatsOverview(params: { userId: number }) {
  const { data } = await api.get<PersonalRevenueOverview>(`dashboard/therapistTrafficlight-personalRevenueStatistics-overview`, { params });
  return data;
}

// 紅綠燈指標-個人營業額｜計分詳情與資料-列表
export interface PersonalRevenueDetail {
  id: number;
  date: string;
  spaceName: string;
  type: TransactionTypes;
  amount: number;
  pointPaymentPlan: string;
  pointPaymentClientGroupName: string;
  pointPaymentClientGroupType: number;
  paidPointGained: number;
  giftPointGained: number;
  groupClassName: string;
  ticketGained: number;
  pointUsed: number;
  pointPaymentMultiChannelPay: {
    payMethod: number;
    amount: number;
    authorisationCode: string;
    receiptNumber: string;
    details: string;
  }[];
  clientSchedulePaymentMultiChannelPay: {
    payMethod: number;
    clientGroupName: string;
    pointUsed: number;
    amount: number;
    authorisationCode: string;
    receiptNumber: string;
    groupClassTicketUsed: number;
    details: string;
  }[];
  groupClassTicketPaymentMultiChannelPay: {
    payMethod: number;
    amount: number;
    authorisationCode: string;
    receiptNumber: string;
    details: string;
  }[];
  addOnServices: AddOnService;
  isDeleted: boolean;
  clientId: number;
  clientName: string;
  seller: User;
}
export async function getPersonalRevenueStatsList(params: ReferralListQuery) {
  const { data, meta } = await api.get<PersonalRevenueDetail[], PagingMeta>(`dashboard/therapistTrafficlight-personalRevenueStatistics-list`, { params });
  return { data, meta };
}
