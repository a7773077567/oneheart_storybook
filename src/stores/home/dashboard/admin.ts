import type { Space, User } from '@/api';
import type PieChart from '@/components/shared/PieChart.vue';
import { LimitColors, LoopColors } from '@/const/dashboard';
import { ShiftType } from '@/const/general';
import { useUserStore } from '@/stores/user';
import type { PageMeta, TherapistClientGroupStatistic, TherapistClientScheduleStatics, TherapistEducationPoint, TherapistOverviewStatistic, TherapistTurnoverStatistic, TherapistTurnoverStatisticsDetailsData, TodayBusinessStatus } from '@/types/home/dashboard/admin';
import { api } from '@/utils/api';
import { minsToHrs, reduceMinsToHrs } from '@/utils/date';
import { calcPercentage } from '@/utils/helpers';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

;

type PieChartProps = InstanceType<typeof PieChart>['$props'];

interface State {
  therapistClientScheduleStatics: TherapistClientScheduleStatics;
  therapistEducationPoint: TherapistEducationPoint;
  todayBusinessStatus: TodayBusinessStatus;
  therapistOverviewStatistics: TherapistOverviewStatistic;
  therapistTurnoverStatistics: TherapistTurnoverStatistic;
  therapists: User[];
  turnover: {
    data: TherapistTurnoverStatisticsDetailsData[];
    meta: PageMeta | null;
    pagination: {
      page: number;
      rowsPerPage: number;
      rowsNumber: number;
    };
  };
  clientGroup: {
    data: TherapistClientGroupStatistic[];
    meta: PageMeta | null;
    pagination: {
      page: number;
      rowsPerPage: number;
      rowsNumber: number;
    };
  };
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
      todayBusinessStatus: {
        therapistExecutionHoursStatistic: [],
        newAndReturnStatistic: [],
        onetimeAndSessionsPurchaseStatistic: [],
        allPaymentStatistic: [],
      },
      therapistOverviewStatistics: {
        averageExecutionCount: 0,
        returnVisitRate: 0,
        clientRate: 0,
        referralCount: 0,
      },
      therapistTurnoverStatistics: {
        lineChartData: [],
        firstSessionPurchase: 0,
        onetimePurchase: 0,
        secondSessionPurchase: 0,
      },
      therapists: [],
      turnover: {
        data: [],
        meta: null,
        pagination: {
          page: 1,
          rowsPerPage: 6,
          rowsNumber: 0,
        },
      },
      clientGroup: {
        data: [],
        meta: null,
        pagination: {
          page: 1,
          rowsPerPage: 4,
          rowsNumber: 0,
        },
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
        title: '病例狀態',
        chartData: {
          labels: source.map(item => item.label),
          data: data.map(item => item.chartData),
          backgroundColor: LimitColors,
        },
        infoData: data.map(item => item.infoData),
        infoWidth: '301px',
      };
    },

    checkoutPlanStatistics(state): PieChartProps {
      const source = state.therapistClientScheduleStatics.purchaseStatistic;
      const totalCount = source.reduce((acc, item) => acc + item.value, 0);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalCount);
        const amount = item.amount.toLocaleString('en-us');
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} (${item.value} 件) $${amount}`],
          },
          infoData: {
            label: item.label,
            values: [`${item.value}件`, `$${amount}`, percentage],
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
        infoWidth: '301px',
      };
    },
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
    allPaymentStatistic(state): PieChartProps {
      const source = state.todayBusinessStatus.allPaymentStatistic;
      const totalAmount = source.reduce((acc, item) => acc + item.value, 0);
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item.value, totalAmount);
        const amount = item.value.toLocaleString('en-us');
        return {
          chartData: {
            value: item.value,
            tooltip: [`${item.label} ${percentage} ($${amount})`],
          },
          infoData: {
            label: item.label,
            values: [`$${item.value.toLocaleString('en-us')}`, percentage],
            color: LoopColors[idx],
          },
        };
      });
      return {
        title: '各支付方式金額',
        subtitle: `總金額 $${totalAmount}`,
        chartData: {
          labels: source.map(item => item.label),
          data: data.map(item => item.chartData),
          backgroundColor: LoopColors,
        },
        infoData: data.map(item => item.infoData),
      };
    },
    turnoverLineChartData(state) {
      const source = state.therapistTurnoverStatistics.lineChartData;
      const labels = source.map((item) => {
        switch (item.type) {
          case 'today':
            return dayjs(item.time).format('HH:mm');
          case 'month':
            return `${item.day}日`;
          case 'quarter':
            return `${item.isoweek}週`;
          default:
            return `${item.month! + 1}月`;
        }
      });
      const data = source.map(item => item.value);
      return {
        labels,
        data,
        options: {
          pointBackgroundColor: '#3A4E6B',
          pointBorderColor: '#3A4E6B',
          pointBorderWidth: 4,
          borderColor: '#3A4E6B',
          borderWidth: 2,
        },
      };
    },
    turnoverPieChartData(state): PieChartProps {
      const { onetimePurchase, firstSessionPurchase, secondSessionPurchase } = state.therapistTurnoverStatistics;
      const source = [onetimePurchase, firstSessionPurchase, secondSessionPurchase];
      const totalAmount = source.reduce((acc, item) => acc + item, 0);
      const labels = ['單次消費', '初次堂數購買', '二次購買堂數'];
      const data = source.map((item, idx) => {
        const percentage = calcPercentage(item, totalAmount);
        const currency = item.toLocaleString('en-us');
        return {
          chartData: {
            value: item,
            tooltip: [`${labels[idx]} ${percentage}($${currency})`],
          },
          infoData: {
            label: labels[idx],
            values: [`$${currency}`, percentage],
            color: LimitColors[idx],
          },
        };
      });

      return {
        title: `總營業額 $${totalAmount.toLocaleString('en-us')}`,
        chartData: {
          labels,
          backgroundColor: LimitColors,
          data: data.map(item => item.chartData),
        },
        infoData: data.map(item => item.infoData),

      };
    },
    turnoverDetailRows(state) {
      return state.turnover.data.map((item) => {
        return {
          ...item,
          userShiftType: ShiftType[item.userShiftType],
        };
      });
    },
    clientGroupRows(state) {
      return state.clientGroup.data.map((item) => {
        const details = item.clientGroupDetails.map((detail) => {
          return [detail.label, detail.points];
        });
        return {
          ...Object.fromEntries(details),
          clientName: item.clientName,
          clientId: item.clientId,
        };
      });
    },
    therapistOptions(state) {
      const userStore = useUserStore();
      const therapistForLead = state.therapists.filter(item => item.role.type === 5);
      const targetTherapist = [2, 3].includes(userStore.userInfo!.role.type)
        ? state.therapists
        : therapistForLead;
      const options = targetTherapist.map(item => ({ label: item.name, value: item.id }));

      return [{ label: '所有治療師', value: 0 }, ...options];
    },
    roleQuery() {
      const userStore = useUserStore();
      return {
        isManagement: [2, 3, 4].includes(userStore.userInfo!.role.type),
        isDirector: [2, 3].includes(userStore.userInfo!.role.type),
        isLeadTherapist: [4].includes(userStore.userInfo!.role.type),
        isTherapist: [5].includes(userStore.userInfo!.role.type),
      };
    },
    userId() {
      const userStore = useUserStore();
      return userStore.userInfo!.id;
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

    async getTodayBusinessStatus() {
      const { data } = await api.get<TodayBusinessStatus>('dashboard/today-businessStatus');
      this.todayBusinessStatus = data;
    },

    async getTherapistOverviewStatistics(params: {
      userId?: number;
      userShiftTypes: number[];
    }) {
      const { data } = await api.get<TherapistOverviewStatistic>('dashboard/therapistOverviewStatics', { params });
      this.therapistOverviewStatistics = data;
    },

    async getTherapists() {
      const { data: spaces } = await api.get<Space[]>('spaces');
      const spaceIds = spaces.map(item => item.id);
      const roleTypes = [2, 3, 4, 5];

      const { data } = await api.get<User[]>('users', { params: { spaceIds, roleTypes } });
      this.therapists = data;
    },

    async getTherapistTurnoverStatistics(params: {
      dateRange: string;
    }) {
      const { data } = await api.get<TherapistTurnoverStatistic>('dashboard/therapistTurnoverStatistics', { params });
      this.therapistTurnoverStatistics = data;
    },

    async getTherapistTurnoverStatisticsDetails(params: {
      dateRange: string;
      queryType: string;
      page: number;
      take: number;
      order?: 'ASC' | 'DESC';
    }) {
      const { data, meta } = await api.get<TherapistTurnoverStatisticsDetailsData[], PageMeta>('dashboard/therapistTurnoverStatisticsDetailList', { params });
      this.turnover.data = data;
      this.turnover.meta = meta!;
      const { page, itemCount, take } = meta!;
      this.turnover.pagination.page = page;
      this.turnover.pagination.rowsNumber = itemCount;
      this.turnover.pagination.rowsPerPage = take;
    },
    async  getTherapistClientGroupStatistics(params: {
      page?: number;
      take?: number;
      order?: 'ASC' | 'DESC';
    }) {
      const { data, meta } = await api.get<TherapistClientGroupStatistic[], PageMeta>('dashboard/therapistClientGroupStatistics', { params });
      this.clientGroup.data = data;
      this.clientGroup.meta = meta!;
      const { page, itemCount, take } = meta!;
      this.clientGroup.pagination.page = page;
      this.clientGroup.pagination.rowsNumber = itemCount;
      this.clientGroup.pagination.rowsPerPage = take;
    },
  },
});
