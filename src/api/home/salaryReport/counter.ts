import { api } from '@/utils/api';

export interface CounterSalaryDetail {
  id: number;
  totalAmount: number;
  baseSalary: number;
  profitShareAmount: ProfitShareAmount;
  extraBonusAmount: number;
  counterQuarterlyBonus: CounterQuarterlyBonus[];
  isConfirmed: boolean;
}

interface CounterQuarterlyBonus {
  space: Space;
  therapistCount: number;
  quarterlyExecutionCount: number;
  quarterlyRevenueAmount: number;
  finalPercentage: number;
  quarterlyBonusAmount: number;
  totalCounterShares: number;
  fullTimeCounterUserCount: number;
  partTimeCounterUserCount: number;
  userShare: number;
  commissionAmount: number;
  averagePrice: number;
  executionCountStandardPerPerson: number[];
  quarterlyExecutionStandard: number[];
  quarterlySalesStandard: number[];
  commissionRatios: number[];
}

interface Space {
  id: number;
  name: string;
  type: number;
}

interface ProfitShareAmount {
  amount: number;
  totalRechargeAmount: number;
  profitSharePercentage: number;
}

export async function fetchCounterSalaryDetail(userId: number, yearMonth: string) {
  const { data } = await api.get<CounterSalaryDetail>(`salaries/counter-salary-detail`, { params: { userId, yearMonth } });
  return data;
}

export async function confirmCounterSalary(payload: { yearMonth: string }) {
  const { data } = await api.post(`salaries/confirm-counter-salary`, payload);
  return data;
}
