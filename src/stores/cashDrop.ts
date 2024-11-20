import { type CashDropPayload, type CashDropRecord, type CashDropRecordsMeta, type CashDropRecordsParams, type CashDropRes, cashDropApi } from '@/api/cashDrop';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

interface State {
  cashDropRes: CashDropRes | null;
  cashDropRecords: CashDropRecord[];
  cashDropRecordsMeta: CashDropRecordsMeta | null;

}

export const useCashDropStore = defineStore('cashDrop', {
  state(): State {
    return {
      cashDropRes: null,
      cashDropRecords: [],
      cashDropRecordsMeta: null,
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
    cashDropRecordRows(state) {
      return state.cashDropRecords.map((record) => {
        const { id, cashDropDate, user, cashDropAmount } = record;
        return {
          id,
          date: dayjs(cashDropDate).format('YYYY-MM-DD'),
          time: dayjs(cashDropDate).format('HH:mm'),
          userName: user.name,
          dropAmount: cashDropAmount,
        };
      });
    },
  },
  actions: {
    async cashDrop(payload: CashDropPayload) {
      const data = await cashDropApi.cashDrop(payload);
      this.cashDropRes = data;
    },

    async getCashDropRecords(params: CashDropRecordsParams) {
      const { data, meta } = await cashDropApi.getCashDropRecords(params);
      this.cashDropRecords = data;
      this.cashDropRecordsMeta = meta!;
      return { data, meta };
    },

    async getCashDrop(cashDropId: number) {
      const data = await cashDropApi.getCashDrop(cashDropId);
      this.cashDropRes = data;
    },
  },
});
