import { type ChangeShiftPayload, type ChangeShiftRes, type HandoverRecordListItem, type HandoverRecordListMeta, type HandoverRecordListParams, handoverApi } from '@/api/home/handover';
import { CashDropType } from '@/const/cashDrop';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { pick } from 'radash';

interface State {
  changeShiftRes: ChangeShiftRes | null;
  handoverRecordList: HandoverRecordListItem[];
  handoverRecordListMeta: HandoverRecordListMeta | null;
  isNeedToShiftChange: boolean;
}

export const useHandoverStore = defineStore('handover', {
  state(): State {
    return {
      changeShiftRes: null,
      handoverRecordList: [],
      handoverRecordListMeta: null,
      isNeedToShiftChange: false,
    };
  },
  getters: {
    handoverDetails(state) {
      if (!state.changeShiftRes) {
        return null;
      }
      const { changeShiftRes } = state;
      const { previousShiftChangeDate, shiftChangeDate } = changeShiftRes;
      return {
        ...changeShiftRes,
        duration: `${dayjs(previousShiftChangeDate).format('YYYY-MM-DD HH:mm')} 至 ${dayjs(shiftChangeDate).format('YYYY-MM-DD HH:mm')}`,
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

    cashDropRecordRows(state) {
      return state.handoverRecordList.map((record) => {
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
    async changeShift(payload: ChangeShiftPayload) {
      const data = await handoverApi.changeShift(payload);
      this.changeShiftRes = data;
      return data;
    },

    async getHandoverRecordList(params: HandoverRecordListParams) {
      const { data, meta } = await handoverApi.getHandoverRecordList(params);
      this.handoverRecordList = data;
      this.handoverRecordListMeta = meta!;
      return { data, meta };
    },

    async getHandoverRecord(recordId: number) {
      const data = await handoverApi.getHandoverRecord(recordId);
      this.changeShiftRes = data;
    },

    async getShiftChangeReminder() {
      const data = await handoverApi.getShiftChangeReminder();
      this.isNeedToShiftChange = data.isNeedToShiftChange;
    },
  },
});
