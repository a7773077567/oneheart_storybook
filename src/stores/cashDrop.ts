import { type CashDrop, type CashDropRes, cashDropApi } from '@/api/cashDrop';
import { defineStore } from 'pinia';

interface State {
  cashDropRes: CashDropRes | null;
}

export const useCashDropStore = defineStore('cashDrop', {
  state(): State {
    return {
      cashDropRes: null,
    };
  },
  getters: {
    cashDropDetails(state) {
      if (!state.cashDropRes) {
        return [];
      }
      const { previousCashDropDate, cashDropDate, user, space, cashDropAmount } = state.cashDropRes;
      return [
        { key: 'date', value: `${previousCashDropDate} 至 ${cashDropDate}`, span: true, custom: true },
        { key: 'account', value: user.name, label: '人員' },
        { key: 'space', value: space.name, label: '場館' },
        { key: 'cashDropAmount', value: cashDropAmount, label: '投庫金額', span: true },
      ];
    },
  },
  actions: {
    async cashDrop(payload: CashDrop) {
      const data = await cashDropApi.cashDrop(payload);
      this.cashDropRes = data;
    },
  },
});
