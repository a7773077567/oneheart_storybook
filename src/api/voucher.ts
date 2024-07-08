import { api } from '@/utils/api';
import type { PaymentTypes } from '@/const/general';

export interface Voucher {

}

export interface PurchaseVoucher {
  counts: number;
  classId: number;
  amount: number;
  clientId: number;
  payMethod: PaymentTypes;
}

// 購買團課券
export async function purchaseVoucher(param: PurchaseVoucher) {
  await api.post(`/clientGroups`, param);
}

// 取得所有團課券

// 移轉團課券
