import { api } from '@/utils/api';
import type { PaymentTypes } from '@/const/general';

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
  payMethod: PaymentTypes;
  authorisationCode: string | null; // 信用卡授權碼，如果payMethod!=信用卡，此欄位必為null
  receiptNumber: string | null; // 信用卡簽單號，如果payMethod!=信用卡，此欄位必為null
}

// 購買團課券
export async function buyGroupClassTickets(param: PurchaseVoucher) {
  await api.post(`/groupClassTickets`, param);
}

// 移轉團課券
