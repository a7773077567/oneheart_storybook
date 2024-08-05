import { defineStore } from 'pinia';
import { type GroupClass, type PurchaseVoucher, fetchGroupShiftTemplates } from '@/api';

interface State {
  voucherDetail: Partial<VoucherDetail> | null;
  groupClassList: GroupClass[];
}

export interface VoucherDetail extends PurchaseVoucher {
  clientName: string;
  clientPhone: string;
  groupClassName: string;
}

export const useVoucherStore = defineStore('voucher', {
  state: (): State => {
    return {
      voucherDetail: null,
      groupClassList: [],
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
