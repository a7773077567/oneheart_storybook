import { defineStore } from 'pinia';
import type { PurchaseVoucher } from '@/api';

interface State {
  voucherDetail: Partial<VoucherDetail> | null;
}

interface VoucherDetail extends PurchaseVoucher {
  clientName: string;
  clientPhone: string;
}

export const useVoucherStore = defineStore('voucher', {
  state: (): State => {
    return {
      voucherDetail: null,
    };
  },
  getters: {

  },
  actions: {

  },
});
