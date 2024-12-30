import { defineStore } from 'pinia';
import { type Client, type GroupClass, type PurchaseVoucher, fetchGroupShiftTemplates } from '@/api';

interface State {
  voucherDetail: VoucherDetail | null;
  groupClassList: GroupClass[];
  targetClient: null | Partial<Client>;
}

export interface VoucherDetail extends PurchaseVoucher {
  clientName: string;
  clientPhone: string;
  groupClassName: string;
  sellerName?: null | string;
}

export const useVoucherStore = defineStore('voucher', {
  state: (): State => {
    return {
      voucherDetail: null,
      groupClassList: [],
      targetClient: null,
    };
  },
  getters: {
    groupClassOptions: state => state.groupClassList?.map(groupClass => ({ label: groupClass.name, value: groupClass.id })),
  },
  actions: {
    async getGroupClass() {
      this.groupClassList = await fetchGroupShiftTemplates();
    },
  },
});
