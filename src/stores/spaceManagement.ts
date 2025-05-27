import { type SpaceMonthlyConfig, type UpdateSpaceMonthlyConfig, fetchSpaceMonthlyConfigList, updateSpaceMonthlyConfig } from '@/api/spaceManagement';
import { defineStore } from 'pinia';

interface State {
  spaceMonthlyConfigList: SpaceMonthlyConfig[];
}

export const useSpaceManagementStore = defineStore('spaceManagement', {
  state: (): State => ({
    spaceMonthlyConfigList: [],
  }),
  getters: {
    spaceMonthlyConfigRows: (state) => {
      return state.spaceMonthlyConfigList.map((spaceMonthlyConfig) => {
        return {
          raw: spaceMonthlyConfig,
          ...spaceMonthlyConfig,
          therapistNumber: `${spaceMonthlyConfig.therapistNumber} 人`,
          customerComplaintsAndRefundRate: `${spaceMonthlyConfig.customerComplaintsAndRefundRate} %`,
        };
      });
    },

  },
  actions: {
    async getSpaceMonthlyConfigList(yearMonth: string) {
      this.spaceMonthlyConfigList = await fetchSpaceMonthlyConfigList(yearMonth);
    },

    async updateSpaceMonthlyConfig(spaceId: number, payload: UpdateSpaceMonthlyConfig) {
      await updateSpaceMonthlyConfig(spaceId, payload);
    },
  },
});
