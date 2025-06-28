import { defineStore } from 'pinia';
import type { CoachSalaryDetail } from '@/types/home/salaryReport/coach';
import { fetchCoachSalaryDetail } from '@/api/home/salaryReport/coach';
import { toCurrency } from '@/utils/helpers';
import { useUserStore } from '@/stores/user';

interface State {
  coachSalaryDetail: CoachSalaryDetail | null;
}

export const useSalaryReportCoachStore = defineStore('salaryReportCoach', {
  state: (): State => ({
    coachSalaryDetail: null,
  }),
  getters: {
    totalAmount: (state) => {
      if (!state.coachSalaryDetail) {
        return 0;
      }
      return state.coachSalaryDetail.totalAmount;
    },
    baseSalary: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '本薪',
          amount: 0,
          details: [],
        };
      }
      const { baseSalary } = state.coachSalaryDetail;

      return {
        label: '本薪',
        amount: baseSalary,
        details: [
          ['本薪', toCurrency(baseSalary), `您的本薪為 ${toCurrency(baseSalary)}`],
        ],
      };
    },
    performanceBonus: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '業績獎金',
          amount: 0,
          details: [],
        };
      }
      const { amount, basic, executions, hours, minimumHours, tiered } = state.coachSalaryDetail.performanceBonus;
      const basicAmount = basic.unitPrice * (hours > 80 ? 80 : hours);
      // TODO: basic, tiered to be confirmed
      const executionString = `${executions.reduce((acc, item, idx) => {
        const original = `( ${item.label} ${item.hours} × ${item.weight} )`;
        const appendPlus = idx !== executions.length - 1 ? `${original} + ` : original;
        return `${acc}${appendPlus}`;
      }, `你的總執行數 = ${hours}\n`)} = ${hours}`;
      const isAboveThreshold = hours > minimumHours;
      const infos = isAboveThreshold
        ? [`您的總執行數為 ${hours} 小時，前 ${minimumHours} 次（最低執行數）計入基本獎金，其餘計入階梯獎金。`, `總執行數計算`]
        : [`您本期的總執行時數為 ${hours} 小時，未達最低門檻 ${minimumHours} 小時，因此無法獲得獎金資格。`, `總執行數計算`];

      return {
        label: '業績獎金',
        amount,
        details: isAboveThreshold
          ? [
              [{ executionString, infos }],
              ['基本獎金', toCurrency(basicAmount), `基本獎金 =\n\n最低執行數 ${minimumHours} * 業績獎金單位金額 $${basic.unitPrice}\n\n= ${toCurrency(basicAmount)}`],
              ['階梯獎金', toCurrency(2000), `階梯獎金 =\n\n10 次執行數為一階，每階單位金額增加 $${tiered.unitPrice}\n第 81～90 次：10 × 25 = $250\n第 91～100 次：10 × 50 = $500\n第 101～110 次：10 × 75 = $750\n第 111～115 次：5 × 100 = $500\n\n= ${toCurrency(2000)}`],
            ]
          : [
              [{ executionString, infos }],
            ],
      };
    },
    spaceRental: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '場租',
          amount: 0,
          details: [],
        };
      }
      const { amount, hours, unitPrice } = state.coachSalaryDetail.spaceRental;
      const infos = [`您本期場租時數為 0。`];

      return {
        label: '場租',
        amount: -amount,
        details: amount === 0
          ? [infos]
          : [
              [`場租時數 * ${unitPrice}`, toCurrency(-amount), `場租時數 = ${hours} hr`, `場租價格 = ${toCurrency(unitPrice)}/hr`],
            ],
      };
    },
    performanceChampion: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '業績王',
          amount: 0,
          details: [],
        };
      }
      const { amount } = state.coachSalaryDetail.performanceChampion;
      const infos = [`未達標。需為當月營業額最高者才能獲得業績王獎金 ${toCurrency(amount)}`];
      return {
        label: '業績王',
        amount,
        details: amount === 0
          ? [[infos]]
          : [
              ['業績王', toCurrency(amount), `恭喜您本月個人營業額為最高，為業績王！`],
            ],
      };
    },
    executionChampion: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '執行王',
          amount: 0,
          details: [],
        };
      }
      const { amount } = state.coachSalaryDetail.executionChampion;
      const infos = [`未達標。需為當月總執行數最高者才能獲得執行王獎金 ${toCurrency(amount)}`];
      return {
        label: '執行王',
        amount,
        details: amount === 0
          ? [[infos]]
          : [
              ['執行王', toCurrency(amount), `恭喜您本月總執行數為最高，為執行王！`],
            ],
      };
    },
    quarterlyBonus: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '季獎金',
          amount: 0,
          details: [],
        };
      }
      const { coachQuarterlyBonus } = state.coachSalaryDetail;
      const amount = coachQuarterlyBonus.reduce((acc, item) => acc + item.bonusAmount, 0);
      const infos = [`季獎金發放時間為「1、4、7、10」月。`];
      const details = coachQuarterlyBonus.map((item) => {
        return [
          `季獎金（${item.space.name}）`,
          toCurrency(item.bonusAmount),
          [`個人季獎金 = ${toCurrency(item.personalBonus)}`, `團體季獎金 = ${toCurrency(item.teamBonus)}`, `職等季獎金 = ${toCurrency(item.rankBonus)}`],
        ];
      });
      return {
        label: '季獎金',
        amount,
        details: amount === 0
          ? [[infos]]
          : [
              [infos],
              ...details,
            ],
      };
    },
    partTimeSalary: (state) => {
      if (!state.coachSalaryDetail) {
        return {
          label: '兼職人員薪資',
          amount: 0,
          details: [],
        };
      }
      const { amount, basic, hours } = state.coachSalaryDetail.performanceBonus;

      return {
        label: '兼職人員薪資',
        amount,
        details: [
          ['總執行時數 * 業績獎金單位金額', toCurrency(amount), `總執行數 = ${hours} hr`, `業績獎金單位金額 = ${basic.unitPrice}`],
        ],
      };
    },
  },

  actions: {
    async getCoachSalaryDetail(userId: number, yearMonth: string) {
      this.coachSalaryDetail = await fetchCoachSalaryDetail(userId, yearMonth);
    },
  },
});
