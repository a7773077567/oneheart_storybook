import { api } from '@/utils/api';
import type { PaymentTypes, TransactionTypes } from '@/const/general';
import type { PagingMeta } from '@/types/common';
import type { Client } from './clientManagement';
import type { UserShift } from './shift';

interface BasicPaymentRecord {
  amount: number;
  clientId: number;
  clientName: string;
  date: string;
  id: number;
  spaceName: null | string;
}

// 門診結帳
export interface MedicalPaymentRecord extends BasicPaymentRecord {
  clientSchedulePaymentMultiChannelPay: {
    payMethod: number;
    usedPoint: number;
    amount: number;
    authorisationCode: null | string;
    receiptNumber: null | string;
    ticketUsed: number;
  }[];
  groupClassTicketPaymentMultiChannelPay: null;
  pointPaymentMultiChannelPay: null;
  type: TransactionTypes.門診費用;
}

// 點數購買
export interface PointsPaymentRecord extends BasicPaymentRecord {
  clientSchedulePaymentMultiChannelPay: null;
  groupClassTicketPaymentMultiChannelPay: null;
  pointPaymentMultiChannelPay: {
    payMethod: number;
    amount: number;
    authorisationCode: null | string;
    receiptNumber: null | string;
  }[];
  type: TransactionTypes.點數交易;
  paidPointGained: number;
  giftPointGained: number;
}

// 團課券購買
export interface VoucherPaymentRecord extends BasicPaymentRecord {
  clientSchedulePaymentMultiChannelPay: null;
  groupClassTicketPaymentMultiChannelPay: {
    payMethod: number;
    amount: number;
    authorisationCode: null | string;
    receiptNumber: null | string;
  }[];
  pointPaymentMultiChannelPay: null;
  ticketGained: number;
  type: TransactionTypes.團課券購買;
}

export interface PaymentQuery {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  nameOrPhone?: string;
  startDate: string;
  endDate: string;
}

// 客戶所有交易紀錄
type AllRecords = MedicalPaymentRecord | PointsPaymentRecord | VoucherPaymentRecord;
export async function getPayments(params?: PaymentQuery) {
  const { data, meta } = await api.get<AllRecords[], PagingMeta>(`payments`, { params });
  return { data, meta };
}

// 單一交易記錄
type PaymentDetail = (MedicalPaymentRecord | PointsPaymentRecord | VoucherPaymentRecord) & { client: Client; userShift: UserShift | null };
export async function getSinglePayment(paymentId: number) {
  const { data } = await api.get<PaymentDetail>(`payments/${paymentId}`);
  return data;
}
