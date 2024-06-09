import { api } from '@/utils/api';
import type { PaymentTypes, TransactionTypes } from '@/const/general';
import type { PagingMeta } from '@/types/common';
import type { Client } from './clientManagement';

export interface Payment {
  date: string;
  spaceName: string;
  type: `${TransactionTypes}`;
  paymentMethod: `${PaymentTypes}`;
  usedPoint: number | null;
  amount: number | null;
  clientId: number;
  clientName: string;
}

export interface PaymentQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  phone?: string;
  name?: string;
  startDate: string;
  endDate: string;
}

type PaymentDetail = Omit<Payment, 'clientId' | 'clientName'> & { client: Client };

// 客戶所有交易紀錄
export async function getPayments(params?: PaymentQuery) {
  const { data, meta } = await api.get<{ data: Payment[]; meta: PagingMeta }>(`payments`, { params });
  return { data, meta };
}

// 單一交易記錄
export async function getSinglePayment(paymentId: number) {
  const { data } = await api.get<PaymentDetail>(`payments/${paymentId}`);
  return data;
}
