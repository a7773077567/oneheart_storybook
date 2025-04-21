import { RoleType, fetchUsers, getTherapistTrafficLight } from '@/api';
import type { SignalRange, TrafficLightStatistic, User, getReferralStatsList } from '@/api';
import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/user';

interface State {
  targetTherapistTrafficLight: TrafficLightStatistic;
  therapistList: User[];
}

export const useTrafficLight = defineStore('traffic-light', {
  state(): State {
    return {
      targetTherapistTrafficLight: {
        isWorkOverThreeMonth: false,
        predictionPoint: 0,
        currentPoint: 0,
        rules: [
          {
            light: 'red',
            min: 0,
            max: 40,
          },
          {
            light: 'yellow',
            min: 40,
            max: 60,
          },
          {
            light: 'green',
            min: 60,
            max: null, // Infinity
          },
        ],
        executionCount: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
        returnVisitRate: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
        presonalRevenue: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
        referralCount: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
        educationPoint: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
        googleCommentCount: {
          predictionPoint: 0,
          currentPoint: 0,
          totalPoint: 0,
        },
      },
      therapistList: [],
    };
  },
  getters: {
    trafficLightRules: (state): SignalRange[] => {
      console.log(state.targetTherapistTrafficLight);

      return state.targetTherapistTrafficLight.rules?.length === 0 ? [{
        light: 'red',
        min: 0,
        max: 40,
      }, {
        light: 'yellow',
        min: 40,
        max: 60,
      }, {
        light: 'green',
        min: 60,
        max: null, // Infinity
      }] : state.targetTherapistTrafficLight.rules;
    },
    therapistFilterOptions: (state) => {
      const userStore = useUserStore();
      let options = state.therapistList?.map(item => ({ label: item.name, value: item.id }));
      if (userStore.userInfo?.role.type !== RoleType['物理治療師']) {
        options = [{ label: '所有治療師', value: 0 }, ...options];
      }
      return options;
    },
    scorerOptions: (state) => {
      let options = state.therapistList?.map(item => ({ label: item.name, value: item.id })) ?? [];
      return options;
    },
  },
  actions: {
    async getTherapistTrafficLight(params: { userId: number }) {
      const data = await getTherapistTrafficLight(params);
      this.targetTherapistTrafficLight = data;
    },
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
