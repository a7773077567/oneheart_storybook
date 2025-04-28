import { PTLevel, RoleType, fetchUsers, getTherapistTrafficLight } from '@/api';
import type { SignalRange, TrafficLightStatistic, User, getReferralStatsList } from '@/api';
import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/user';

interface State {
  therapistList: User[];
}

export const useBonusStore = defineStore('points-bonus', {
  state(): State {
    return {
      therapistList: [],
    };
  },
  getters: {
    therapistFilterOptions: (state) => {
      const userStore = useUserStore();
      let options = state.therapistList?.map(item => ({ label: item.name, value: item.id }));
      if (userStore.userInfo?.role.type === RoleType['系統管理者'] || userStore.userInfo?.role.type === RoleType['院長'] || userStore.userInfo?.role.type === RoleType['副院長'] || userStore.userInfo?.role.type === RoleType['物理治療師組長']) {
        return options = [{ label: '所有治療師', value: 0 }, ...options];
      }

      return options;
    },
    scorerOptions: (state) => {
      let options = state.therapistList?.map(item => ({ label: item.name, value: item.id })) ?? [];
      return options;
    },
  },
  actions: {
    async getAvailableTherapistList() {
      // 有權限問題，職位為組長、院長、管理者才可拿到全部治療師名單
      const userStore = useUserStore();
      if (userStore.userInfo?.role?.type === RoleType['物理治療師']) {
        return this.therapistList = [{ ...userStore.userInfo }];
      }
      const data = await fetchUsers({ roleTypes: [RoleType['物理治療師'], RoleType['物理治療師組長']] });
      this.therapistList = data;
    },
  },
});
