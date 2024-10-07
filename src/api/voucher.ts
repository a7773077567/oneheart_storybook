import { api } from '@/utils/api';
import type { PaymentTypes } from '@/const/general';
import type { Space } from './user';

export interface GroupClass {
  id: number;
  spaceId: number;
  numberOfClasses: number;
  maxClientsForGroupClass: number;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  remainingClasses: number;
}

export interface PurchaseVoucher {
  clientId: number;
  groupClassId: number;
  ticketGained: number;
  amount: number;
  multiChannelPay: {
    payMethod: number;
    amount: number | null;
    authorisationCode: string | null;
    receiptNumber: string | null;
    details: string;
  }[];
  contractDottedsignTaskId?: string; // todo, revise to type number  #394 暫時移除簽約步驟
}

export type RefundGroupClassTicket = Pick<PurchaseVoucher, 'clientId' | 'groupClassId' | 'amount' | 'multiChannelPay'>;

export interface Voucher {
  id: number;
  space: Space;
  name: string;
  useAbleGroupClassTickets: number;
}

// 購買團課券
export async function buyGroupClassTickets(param: PurchaseVoucher) {
  await api.post(`/groupClassTickets`, param);
}

/**
 * 退款團課券
 * 不用帶張數，後端會一次全部退掉該團課的券
 * @param {object} param
 * @param {number} param.clientId
 * @param {number} param.groupClassId
 * @param {number} param.amount
 * @param {Array} param.multiChannelPay
 */
export async function refundClassTicker(param: RefundGroupClassTicket) {
  await api.post(`/groupClassTickets/refund`, param);
}

// 客戶已註冊的團課券
export async function getClientRegisteredVouchers(clientId: number) {
  const { data } = await api.get<Voucher[]>(`/clients/${clientId}/registeredGroupClasses`);
  return data;
}

// 客戶已購買的團課券
export async function getClientVouchers(clientId: number) {
  const { data } = await api.get<Voucher[]>(`/clients/${clientId}/purchasedGroupClassTickets`);
  return data;
}
