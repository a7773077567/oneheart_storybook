import { api } from '@/utils/api';
import type { Space, User } from '@/api';

export interface CashDropPayload {
  cashDropAmount: number;
}

export interface CashDropRes {
  id: number;
  previousCashDropDate: string;
  cashDropDate: string;
  cashDropAmount: number;
  user: User;
  space: Space;
}

export interface CashDropRecord {
  id: number;
  previousCashDropDate: string;
  cashDropDate: string;
  cashDropAmount: number;
  user: User;
}

export interface CashDropRecordsParams {
  order: 'ASC' | 'DESC';
  page: number;
  take: number;
}

export interface CashDropRecordsMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

async function cashDrop(payload: CashDropPayload) {
  const { data } = await api.post<CashDropRes, CashDropPayload>('cashDrops', payload);
  return data;
}

async function getCashDropRecords(params: CashDropRecordsParams) {
  const { data, meta } = await api.get<CashDropRecord[], CashDropRecordsMeta>('cashDrops', { params });
  return { data, meta };
}

async function getCashDrop(cashDropId: number) {
  const { data } = await api.get<CashDropRes>(`cashDrops/${cashDropId}`);
  return data;
}

export const cashDropApi = {
  cashDrop,
  getCashDropRecords,
  getCashDrop,
};
