import { type ChangeShiftPayload, type ChangeShiftRes, handoverApi } from '@/api/handover';
import { CashDropType } from '@/const/cashDrop';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { pick } from 'radash';

interface State {
  changeShiftRes: ChangeShiftRes | null;
}

export const useHandoverStore = defineStore('handover', {
  state(): State {
    return {
      changeShiftRes: null,
    };
  },
  getters: {
    handoverDetails(state) {
      if (!state.changeShiftRes) {
        return null;
      }
      const { changeShiftRes } = state;
      return {
        ...changeShiftRes,
        duration: `${changeShiftRes.previousShiftChangeDate} 至 ${changeShiftRes.shiftChangeDate}`,
        overall: pick(changeShiftRes, ['totalIncome', 'totalCashIncome', 'totalCashDropAmount', 'balanceDifference']),
        cashDrops: changeShiftRes.cashDrops.map((cashDrop) => {
          const { cashDropDate, cashDropType, cashDropAmount } = cashDrop;
          return {
            time: { val: dayjs(cashDropDate).format('YYYY-MM-DD HH:mm') },
            type: { val: CashDropType[cashDropType] },
            method: { val: '現金' },
            amount: { val: cashDropAmount },
          };
        }),
        detailedExpenses: changeShiftRes.detailedExpenses.map((expense) => {
          const { name, amount } = expense;
          return {
            type: { val: name, span: 3 },
            amount: { val: amount },
          };
        }),
      };
    },
  },
  actions: {
    async changeShift(payload: ChangeShiftPayload) {
      const data = await handoverApi.changeShift(payload);
      this.changeShiftRes = data;
      return data;
    },
  },
});
