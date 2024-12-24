import { defineStore } from 'pinia';
import { type Client, type PointsGroup, RoleType, fetchUsers, getClientPointGroup } from '@/api';
import { PointTypes } from '@/const/general';

interface State {
  topupDetail: PointsPurchase;
  targetClientPointGroup: PointsGroup[];
  targetClient: Partial<Client> | null;
  sellerOptions: any[];
}

export interface PointsPurchase {
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
  contractDottedsignTaskId: string | null;
  sellerId: number | null;
  sellerName: string | null;
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
  contractDottedsignTaskId: null,
  sellerId: null,
  sellerName: null,
};
export const usePointsStore = defineStore('points', {
  state: (): State => {
    return {
      topupDetail: initialTopup,
      targetClientPointGroup: [],
      targetClient: null,
      sellerOptions: [],
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
    async getSellerOption() {
      const data = await fetchUsers({ roleTypes: [
        RoleType['物理治療師'],
        RoleType['物理治療師組長'],
        RoleType['院長'],
        RoleType['副院長'],
      ] });
      this.sellerOptions = data.map(p => ({ label: p.name, value: p.id }));
    },
  },
});
