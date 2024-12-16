import type { PieChart } from '@/components/shared';
import { LimitColors, LoopColors } from '@/const/dashboard';
import type { TodayBusinessStatus } from '@/types/home/dashboard/reception';
import { api } from '@/utils/api';
import { minsToHrs, reduceMinsToHrs } from '@/utils/date';
import { calcPercentage } from '@/utils/helpers';
import { defineStore } from 'pinia';

type PieChartProps = InstanceType<typeof PieChart>['$props'];

interface State {
  todayBusinessStatus: TodayBusinessStatus;
}

export const useReceptionStore = defineStore('reception', {
  state: (): State => ({
    todayBusinessStatus: {
      therapistExecutionHoursStatistic: [],
      newAndReturnStatistic: [],
      onetimeAndSessionsPurchaseStatistic: [],
      allPaymentStatistic: [],
    },
  }),
  getters: {
    therapistExecutionHoursStatistic: (state): PieChartProps => {
      const source = state.todayBusinessStatus.therapistExecutionHoursStatistic;
      const totalUserShiftHrs = reduceMinsToHrs(source, 'userShiftHoursInMinute');
      const labels = source.map(item => item.label);

      const data = source.map((item, idx) => {
        const completionHrs = minsToHrs(item.completionHoursInMinute);
        const userShiftHrs = minsToHrs(item.userShiftHoursInMinute);
        const percentage = calcPercentage(userShiftHrs, totalUserShiftHrs);
        return {
          chartData: {
            value: item.userShiftHoursInMinute,
            tooltip: [
              `${item.label} ${percentage} (${userShiftHrs} hr)`,
              `已執行: ${completionHrs} hr`,
              `已取消： ${item.cancelledClientScheduleCount} 件`,
              `初診: ${item.firstClientScheduleCount} 件`,
              `空班比例： ${item.emptyShiftPercentage}%`,
            ],
          },
          infoData: {
            label: item.label,
            values: [`${completionHrs}/${userShiftHrs}hr`, percentage],
            color: LoopColors[idx],

          },
        };
      });

      return {
        title: '治療師預約執行時數',
        subtitle: `總時數 ${totalUserShiftHrs} 小時`,
        chartData: {
          labels,
          data: data.map(item => item.chartData),
          backgroundColor: LoopColors,
        },
        infoData: data.map(item => item.infoData),
        infoCaption: '已執行/排班(hr), 佔比(%)',
      };
    },
    newAndReturnStatistic: (state): PieChartProps => {
      const source = state.todayBusinessStatus.newAndReturnStatistic;
      const totalCounts = source.reduce((acc, item) => acc + item.value, 0);
      const labels = source.map(item => item.label);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalCounts);
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} (${item.value} 件)`],
          },
          infoData: {
            label: item.label,
            values: [`${item.value}件`, percentage],
            color: LimitColors[idx],
          },
        };
      });

      return {
        title: '初診複診件數',
        subtitle: `總件數 ${totalCounts} 件`,
        chartData: {
          labels,
          data: data.map(item => item.chartData),
          backgroundColor: LimitColors,
        },
        infoData: data.map(item => item.infoData),
      };
    },
    onetimeAndSessionsPurchaseStatistic: (state): PieChartProps => {
      const source = state.todayBusinessStatus.onetimeAndSessionsPurchaseStatistic;
      const totalCounts = source.reduce((acc, item) => acc + item.value, 0);
      const labels = source.map(item => item.label);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalCounts);
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} (${item.value} 件)`],
          },
          infoData: {
            label: item.label,
            values: [`${item.value}件`, percentage],
            color: LimitColors[idx],
          },
        };
      });

      return {
        title: '單次及堂數消費件數',
        subtitle: `總件數 ${totalCounts} 件`,
        chartData: {
          labels,
          data: data.map(item => item.chartData),
          backgroundColor: LimitColors,
        },
        infoData: data.map(item => item.infoData),
      };
    },
  },
  actions: {
    async getTodayBusinessStatus() {
      const { data } = await api.get<TodayBusinessStatus>('dashboard/today-businessStatus');
      this.todayBusinessStatus = data;
    },
  },
});
