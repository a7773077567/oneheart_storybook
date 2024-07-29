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
}

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

// 移轉團課券

// 客戶已購買的團課券
export async function getClientVouchers(clientId: number) {
  const { data } = await api.get<Voucher[]>(`/clients/${clientId}/registeredGroupClasses`);
  return data;
}
