import { api } from '@/utils/api';
import type { User } from '@/api';

export interface ChangeShiftPayload {
  cashDropAmount: number;
  detailedExpenses: {
    name: string;
    amount: number;
  }[];
}

export interface ChangeShiftRes {
  id: number;
  previousShiftChangeDate: string;
  shiftChangeDate: string;
  totalIncome: number;
  totalCashIncome: number;
  totalCashDropAmount: number;
  balanceDifference: number;
  cashDrops: {
    cashDropAmount: number;
    cashDropDate: string;
    cashDropType: number;
  }[];
  detailedExpenses: {
    name: string;
    amount: number;
    type: number;
  }[];
  user: User;
}

async function changeShift(payload: ChangeShiftPayload) {
  const { data } = await api.post<ChangeShiftRes, ChangeShiftPayload>('shiftChanges', payload);
  return data;
}

export const handoverApi = {
  changeShift,
};
