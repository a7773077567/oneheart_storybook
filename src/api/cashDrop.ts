import { api } from '@/utils/api';
import type { Space, User } from '@/api';

export interface CashDrop {
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

async function cashDrop(payload: CashDrop) {
  const { data } = await api.post<CashDropRes, CashDrop>('cashDrops', payload);
  return data;
}

export const cashDropApi = {
  cashDrop,
};
