import { api } from '@/utils/api';
import type { PaymentTypes, PointTypes, TransactionTypes } from '@/const/general';
import type { PagingMeta } from '@/types/common';
import type { Client } from './clientManagement';
import type { UserShift } from './shift';
import type { AddOnService } from './appointment';

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
  addOnServices: AddOnService[];
  clientSchedulePaymentMultiChannelPay: {
    amount: number;
    authorisationCode: null | string;
    detail: string;
    payMethod: number;
    pointUsed: number;
    receiptNumber: null | string;
    ticketUsed: number;
    clientGroupName: null;
  }[];
  groupClassTicketPaymentMultiChannelPay: null;
  groupClassName: null;
  paidPointGained: null;
  pointPaymentClientGroupName: null;
  pointPaymentClientGroupType: null;
  pointPaymentPlan: null;
  pointUsed: number;
  pointPaymentMultiChannelPay: null;
  type: TransactionTypes.門診費用;
  ticketGained: null;
  giftPointGained: null;
}

// 堂數購買
export interface PointsPaymentRecord extends BasicPaymentRecord {
  clientSchedulePaymentMultiChannelPay: null;
  groupClassTicketPaymentMultiChannelPay: null;
  giftPointGained: number;
  groupClassName: null;
  pointPaymentMultiChannelPay: {
    amount: number;
    authorisationCode: null | string;
    detail: string;
    payMethod: number;
    receiptNumber: null | string;
    pointUsed: null;
    ticketUsed: null;
    clientGroupName: null;
  }[];
  paidPointGained: number;
  pointPaymentClientGroupName: string;
  pointPaymentClientGroupType: PointTypes;
  pointPaymentPlan: string;
  pointUsed: null;
  type: TransactionTypes.堂數交易 | TransactionTypes.堂數退款;

}

// 團課券購買
export interface VoucherPaymentRecord extends BasicPaymentRecord {
  clientSchedulePaymentMultiChannelPay: null;
  giftPointGained: null;
  groupClassName: string;
  groupClassTicketPaymentMultiChannelPay: {
    amount: number;
    authorisationCode: null | string;
    detail: string;
    payMethod: number;
    receiptNumber: null | string;
    pointUsed: null;
    ticketUsed: null;
    clientGroupName: null;
  }[];

  paidPointGained: null;
  pointPaymentClientGroupName: null;
  pointPaymentClientGroupType: null;
  pointPaymentMultiChannelPay: null;
  pointPaymentPlan: null;
  pointUsed: null;
  ticketGained: number;
  type: TransactionTypes.團課券購買 | TransactionTypes.團課券退款;

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
export type PaymentDetail = (MedicalPaymentRecord | PointsPaymentRecord | VoucherPaymentRecord) & { client: Client; userShift: UserShift | null };
export async function getSinglePayment(paymentId: number) {
  const { data } = await api.get<PaymentDetail>(`payments/${paymentId}`);
  return data;
}
