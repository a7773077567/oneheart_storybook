import { defineStore } from 'pinia';
import { type PointsGroup, type TopupDetail, getClientPointGroup } from '@/api';
import { PointTypes } from '@/const/general';

interface State {
  topupDetail: PointsPurchase;
  targetClientPointGroup: PointsGroup[];
}

interface PointsPurchase {
  clientId: number;
  clientName: string;
  clientPhone: string;
  pointType: PointTypes;
  groupName: string;
  clientGroupId: number;
  plan: number | null;
  planName: string;
  paidPointGained: number;
  giftPointGained: number;
  amount: number;
}

const initialTopup = {
  clientId: Number.NaN,
  clientName: '',
  clientPhone: '',
  clientGroupId: Number.NaN,
  pointType: Number.NaN,
  groupName: '',
  plan: 8,
  planName: '',
  paidPointGained: 0,
  giftPointGained: 0,
  amount: 0,
};
export const usePointsStore = defineStore('points', {
  state: (): State => {
    return {
      topupDetail: initialTopup,
      targetClientPointGroup: [],
    };
  },
  getters: {
    pointGroupOptions: (state) => {
      if (!state.targetClientPointGroup || state.targetClientPointGroup.length === 0)
        return [];
      return state.targetClientPointGroup.map(({ id, name, type, points }) => ({ label: `${name} (${PointTypes[type]})`, value: { id, type, name, points } }));
    },
  },
  actions: {
    async getPointGroupOptions(clientId: number) {
      this.targetClientPointGroup = await getClientPointGroup(clientId);
    },
    resetTopup() {
      this.topupDetail = initialTopup;
    },
  },
});
