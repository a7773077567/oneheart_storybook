import type { TrafficLightStatistic, User } from '@/api';
import { defineStore } from 'pinia';
import { RoleType, fetchUsers, getReferralStatsList, getTherapistTrafficLight } from '@/api';

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
    trafficLightRules: (state) => {
      return [
        [
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
          ...state.targetTherapistTrafficLight.rules,
        ],
      ];
    },
    therapistOptions: (state) => {
      const options = state.therapistList?.map(item => ({ label: item.name, value: item.id }));

      return [{ label: '所有治療師', value: 0 }, ...options];
    },
  },
  actions: {
    async getTherapistTrafficLight(params: { userId: number }) {
      const data = await getTherapistTrafficLight(params);
      this.targetTherapistTrafficLight = data;
    },
    async getTherapistList() {
      const data = await fetchUsers({ roleTypes: [RoleType['物理治療師'], RoleType['物理治療師組長']] });
      this.therapistList = data;
    },
  },
});
