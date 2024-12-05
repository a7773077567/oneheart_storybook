import { api } from '@/utils/api';
import type { UserShiftDetail } from '@/api/shift';
import type { Client } from '@/api/clientManagement';
import type { User } from '@/api/user';

type StatisticItem<T extends string> = Record<T, {
  itemCount?: number;
  amount?: number;
  executionHours?: number;
  appointmentHours?: number;
}>;
export type CaseStatusStatistic = StatisticItem<
  'unexecutedCount' |
  'serviceCompletionCount' |
  'caseCompletionCount' |
  'rescheduleCount' |
  'cancellationCount'
>;

export type CheckoutPlanStatistic = StatisticItem<
  'onetimeCash' |
  'fiveSessionsForClient' |
  'tenSessionsForClient'
>;

export interface TherapistOverviewStatistic {
  averageExecutionCount: number;
  returnVisitRate: number;
  clientRate: number;
  referralCount: number;
  educationPoints: {
    predicted: number;
    current: number;
  };
};

export type TherapistExecutionHoursStatistic = (StatisticItem<'statistic'> & User)[];

export type NewAndReturnStatistic = StatisticItem<
  'newCount' |
  'returnCount'
>;

export type OnetimeAndSessionsPurchaseStatistic = StatisticItem<
  'onetimeCash' |
  'sessions'
>;

export type AmountByPaymentMethodStatistic = (StatisticItem<'statistic'> & { payMethod: number })[];

export type RevenueOverview = StatisticItem<
  'onetimePurchase' |
  'firstSessionPurchase' |
  'secondSessionPurchase'
> &
{
  // The length of the length will be one of the following
  // 本日: 14
  // 當月: 28 ~ 31
  // 當季: 13
  // 當年: 12
  // 過去一年: 12
  lineChartData: number[];
};

export interface UserInProgressClientSchedulesParams {
  startDate: string;
  endDate: string;
}

export interface UserInProgressClientSchedule {
  id: number;
  userShift: UserShiftDetail;
  date: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  client: Client;
  state: number;
}

export async function fetchUserInProgressClientSchedules(params: UserInProgressClientSchedulesParams) {
  const { data } = await api.get<UserInProgressClientSchedule[]>('/dashboard/userInProgressClientSchedules', { params });
  return data;
}
