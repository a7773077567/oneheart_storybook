import type { Space, TrafficLightStatistic, User } from '@/api';
import { defineStore } from 'pinia';
import { getTherapistTrafficLight } from '@/api';

interface State {
  targetTherapistTrafficLight: TrafficLightStatistic;
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
  },
  actions: {
    async getTherapistTrafficLight(params: { userId: number }) {
      const data = await getTherapistTrafficLight(params);
      this.targetTherapistTrafficLight = data;
    },
  },
});
