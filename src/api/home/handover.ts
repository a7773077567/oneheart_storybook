import { api } from '@/utils/api';
import type { User } from '@/api';

export interface ChangeShiftPayload {
  cashDropAmount: number;
  detailedExpenses: {
    name: string;
    amount: number;
  }[];
  detailedIncomes: {
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
  detailedIncomes: {
    name: string;
    amount: number;
    type: number;
  }[];
  user: User;
}

export interface HandoverRecordListItem {
  id: number;
  cashDropDate: string;
  cashDropAmount: number;
  user: User;
}

export interface HandoverRecordListMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface HandoverRecordListParams {
  order: 'ASC' | 'DESC';
  page: number;
  take: number;
}

export interface ShiftChangeReminder {
  isNeedToShiftChange: boolean;
}

async function changeShift(payload: ChangeShiftPayload) {
  const { data } = await api.post<ChangeShiftRes, ChangeShiftPayload>('shiftChanges', payload);
  return data;
}

async function getHandoverRecordList(params: HandoverRecordListParams) {
  const { data, meta } = await api.get<HandoverRecordListItem[], HandoverRecordListMeta>('shiftChanges', { params });
  return { data, meta };
}

async function getHandoverRecord(recordId: number) {
  const { data } = await api.get<ChangeShiftRes>(`shiftChanges/${recordId}`);
  return data;
}

async function getShiftChangeReminder() {
  const { data } = await api.get<ShiftChangeReminder>('shiftChanges/shiftChangeReminder');
  return data;
}

export const handoverApi = {
  changeShift,
  getHandoverRecordList,
  getHandoverRecord,
  getShiftChangeReminder,
};
