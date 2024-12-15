import type PieChart from '@/components/shared/PieChart.vue';
import { LimitColors } from '@/const/dashboard';
import type { TherapistClientScheduleStatics, TherapistEducationPoint } from '@/types/home/dashboard/admin';
import { api } from '@/utils/api';
import { calcPercentage } from '@/utils/helpers';
import { defineStore } from 'pinia';

type PieChartProps = InstanceType<typeof PieChart>['$props'];

interface State {
  therapistClientScheduleStatics: TherapistClientScheduleStatics;
  therapistEducationPoint: TherapistEducationPoint;
}

export const useAdminStore = defineStore('admin', {
  state(): State {
    return {
      therapistClientScheduleStatics: {
        clientScheduleStateStatistic: [],
        purchaseStatistic: [],
      },
      therapistEducationPoint: {
        predictedEducationPoint: 0,
        currentEducationPoint: 0,
      },
    };
  },
  getters: {
    caseStatistics(state): PieChartProps {
      const source = state.therapistClientScheduleStatics.clientScheduleStateStatistic;
      const totalCount = source.reduce((acc, item) => acc + item.value, 0);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalCount);
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} ${item.value} 件`],
          },
          infoData: {
            label: item.label,
            values: [`${item.value}件`, percentage],
            color: LimitColors[idx],
          },
        };
      });

      return {
        title: '病例狀態',
        chartData: {
          labels: source.map(item => item.label),
          data: data.map(item => item.chartData),
          backgroundColor: LimitColors,
        },
        infoData: data.map(item => item.infoData),
      };
    },

    checkoutPlanStatistics(state): PieChartProps {
      const source = state.therapistClientScheduleStatics.purchaseStatistic;
      const totalCount = source.reduce((acc, item) => acc + item.value, 0);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalCount);
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} ${item.value} 件`],
          },
          infoData: {
            label: item.label,
            values: [`${item.value}件`, percentage],
            color: LimitColors[idx],
          },
        };
      });

      return {
        title: '結帳方案',
        chartData: {
          labels: source.map(item => item.label),
          data: data.map(item => item.chartData),
          backgroundColor: LimitColors,
        },
        infoData: data.map(item => item.infoData),
      };
    },

  },
  actions: {
    async getTherapistClientScheduleStatics(params: {
      userId?: number;
      dateRange: string;
    }) {
      const { data } = await api.get<TherapistClientScheduleStatics>('dashboard/therapistClientScheduleStatics', { params });
      this.therapistClientScheduleStatics = data;
    },

    async getTherapistEducationPoint(params: { userId: number }) {
      const { data } = await api.get<TherapistEducationPoint>('dashboard/therapistEducationPoint', { params });
      this.therapistEducationPoint = data;
    },

    async updateEducationPoint(payload: {
      userId: number;
      predictedEducationPoint: number;
      currentEducationPoint: number;
    }) {
      const { data } = await api.post('dashboard/therapistEducationPoint', payload);
      return data;
    },
  },
});
