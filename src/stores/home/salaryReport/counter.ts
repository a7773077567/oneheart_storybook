import { type CounterSalaryDetail, fetchCounterSalaryDetail } from '@/api/home/salaryReport/counter';
import { toCurrency } from '@/utils/helpers';
import Therapist from '@/views/home/salaryReport/Therapist.vue';
import { defineStore } from 'pinia';

interface State {
  counterSalaryDetail: CounterSalaryDetail | null;
}

export const useSalaryReportCounterStore = defineStore('salaryReportCounter', {
  state: (): State => ({
    counterSalaryDetail: null,
  }),
  getters: {
    totalAmount: (state) => {
      if (!state.counterSalaryDetail) {
        return 0;
      }
      return state.counterSalaryDetail.totalAmount;
    },
    baseSalary: (state) => {
      if (!state.counterSalaryDetail) {
        return {
          label: '本薪',
          amount: 0,
          details: [],
        };
      }
      const { baseSalary } = state.counterSalaryDetail;

      return {
        label: '本薪',
        amount: baseSalary,
        details: [
          ['本薪', toCurrency(baseSalary), `您的本薪為 ${toCurrency(baseSalary)}`],
        ],
      };
    },
    profitShare: (state) => {
      if (!state.counterSalaryDetail) {
        return {
          label: '儲值抽成',
          amount: 0,
          details: [],
        };
      }
      const { amount, profitSharePercentage, totalRechargeAmount } = state.counterSalaryDetail.profitShareAmount;
      const infos = ['計算本期銷售者為您的儲值方案。'];
      return {
        label: '儲值抽成',
        amount,
        details: [
          [[infos]],
          ['儲值金額*抽成比例', toCurrency(amount), `儲值金額 = ${toCurrency(totalRechargeAmount)}`, `抽成比例 = ${profitSharePercentage * 100}%`],
        ],
      };
    },
    quarterlyBonus: (state) => {
      if (!state.counterSalaryDetail) {
        return {
          label: '季獎金',
          amount: 0,
          details: [],
        };
      }
      const { counterQuarterlyBonus } = state.counterSalaryDetail;
      const infos = [`季獎金發放時間為「1、4、7、10」月。`];
      const amount = counterQuarterlyBonus.reduce((acc, item) => acc + item.commissionAmount, 0);
      const tabs = counterQuarterlyBonus.map((item, idx) => {
        return {
          name: idx,
          label: item.space.name,
        };
      });
      const bonusData = counterQuarterlyBonus.map((bonusItem) => {
        const personalRate = bonusItem.userShare / bonusItem.totalCounterShares;

        const executionPassedIdx = bonusItem.quarterlyExecutionStandard.reduce((acc: null | number, standard, standardIdx) => {
          if (bonusItem.quarterlyExecutionCount >= standard) {
            return standardIdx;
          }
          return acc;
        }, null);

        const salesPassedIdx = bonusItem.quarterlySalesStandard.reduce((acc: null | number, standard, standardIdx) => {
          if (bonusItem.quarterlyRevenueAmount >= standard) {
            return standardIdx;
          }
          return acc;
        }, null);

        return {
          titleInfo: ['本季獎金', toCurrency(bonusItem.commissionAmount), `團隊季獎金 * 個人獎金佔比 =  ${toCurrency(bonusItem.quarterlyBonusAmount)} * ${Number.isNaN(personalRate) ? 0 : personalRate}`],

          team: {
            title: '團隊季獎金',
            data: [
              ['季銷售額', toCurrency(bonusItem.quarterlyRevenueAmount)],
              ['適用抽成比例 (表格➂)', `${bonusItem.finalPercentage}%`],
              ['季獎金計算', `${toCurrency(bonusItem.quarterlyRevenueAmount)} × ${bonusItem.finalPercentage}%`],
              ['', toCurrency(bonusItem.quarterlyBonusAmount)],
            ],
          },
          personal: {
            title: '個人獎金佔比',
            data: [
              [`櫃檯團隊總份數 ( ${bonusItem.fullTimeCounterUserCount} 位正職 + ${bonusItem.partTimeCounterUserCount} 位兼職)`, `${bonusItem.totalCounterShares} 份`],
              [`您的個人份數 (兼職)`, `${bonusItem.userShare} 份`],
              [`您的個人獎金佔比計算`, `${bonusItem.userShare} / ${bonusItem.totalCounterShares}`],
              ['', `${Number.isNaN(personalRate) ? 0 : personalRate}`],
            ],
          },
          commissionRate: {
            title: '抽成比例對照表 (表格➂)',
            gridTitle: [
              {
                label: '本季執行數：',
                value: executionPassedIdx === null
                  ? `${bonusItem.quarterlyExecutionCount} (未達標)`
                  : `${bonusItem.quarterlyExecutionCount}(達 ${(bonusItem.commissionRatios[executionPassedIdx] * 100).toFixed(2)}% 標準)}`,
                isPassed: executionPassedIdx !== null,
              },
              {
                label: '本季銷售額：',
                value: salesPassedIdx === null
                  ? `${toCurrency(bonusItem.quarterlyRevenueAmount)} (未達標)`
                  : `${toCurrency(bonusItem.quarterlyRevenueAmount)}(達 ${(bonusItem.commissionRatios[salesPassedIdx] * 100).toFixed(2)}% 標準)}`,
                isPassed: salesPassedIdx !== null,
              },
              {
                label: '本季適用抽成比例(取較低者):',
                value: `${bonusItem.finalPercentage.toFixed(2)}%`,
                isUsed: bonusItem.finalPercentage !== 0,
              },
            ],
            data: [
              [`執行數單人標準`, ...bonusItem.executionCountStandardPerPerson.map(item => `${item}`)],
              [`本季執行數標準 (註1)`, ...bonusItem.quarterlyExecutionStandard.map((item, idx) => {
                return {
                  value: `${item}`,
                  isPassed: idx === executionPassedIdx,
                };
              })],
              [`本季銷售額標準 (註2)`, ...bonusItem.quarterlySalesStandard.map((item, idx) => {
                return {
                  value: toCurrency(item as number),
                  isPassed: idx === salesPassedIdx,
                };
              })],
              [`抽成比例`, ...bonusItem.commissionRatios.map((item) => {
                return {
                  value: `${(item * 100).toFixed(2)}%`,
                  isUsed: item === bonusItem.finalPercentage,
                };
              })],
            ],
            caption: {
              therapistCount: bonusItem.therapistCount,
              averagePrice: toCurrency(bonusItem.averagePrice),
            },
          },
        };
      });

      return {
        label: '季獎金',
        amount,
        details: [
          [[infos]],
          bonusData.length ? [{ tabs, bonusData }] : [],
        ],
      };
    },
  },
  actions: {
    async getCounterSalaryDetail(userId: number, yearMonth: string) {
      this.counterSalaryDetail = await fetchCounterSalaryDetail(userId, yearMonth);
    },
  },
});
