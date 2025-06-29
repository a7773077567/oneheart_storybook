import { RoleType } from '@/api';
import { type TherapistSalaryDetail, fetchTherapistSalaryDetail } from '@/api/home/salaryReport/therapist';
import { EducationApprenticeLevel, EducationMentorLevel, PositionBonusType, RecommendationBonusType } from '@/const/saplaryReport';
import { useUserStore } from '@/stores/user';
import { transformRelationshipsToTree } from '@/utils/apextree';
import { toCurrency } from '@/utils/helpers';
import { defineStore } from 'pinia';

interface State {
  isAuthenticated: boolean;
  therapistSalaryDetail: TherapistSalaryDetail | null;
}

export const useSalaryReportTherapistStore = defineStore('salaryReportTherapist', {
  state: (): State => ({
    isAuthenticated: false,
    therapistSalaryDetail: null,
  }),
  getters: {
    totalAmount: (state) => {
      if (!state.therapistSalaryDetail) {
        return 0;
      }
      return state.therapistSalaryDetail.totalAmount;
    },
    executionAmount: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '執行時段應發總金額',
          amount: 0,
          details: [],
        };
      }
      const { amount, baseSalary, totalExecutions } = state.therapistSalaryDetail!.executionAmount;
      return {
        label: '執行時段應發總金額',
        amount,
        details: [
          [''],
          ['本薪', toCurrency(baseSalary), `您的本薪為 ${toCurrency(baseSalary)}`],
          [
            '總執行數*單價',
            toCurrency(totalExecutions.amount),
            [
              `總執行數 = ${executionsToString(totalExecutions.executions)} = ${totalExecutions.totalHours}`,
              `單價 = 職階 (PT${totalExecutions.PTLevel}) 對比執行數 = ${toCurrency(totalExecutions.unitPrice)}`,
            ],
          ],
        ],
      };
    },
    shockWaveSharing: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '震波分潤',
          amount: 0,
          details: [],
        };
      }
      const { shockWaveSharing } = state.therapistSalaryDetail;
      return {
        label: '震波分潤',
        amount: shockWaveSharing.amount,
        details: [
          ['震波發數 * 單位金額', toCurrency(shockWaveSharing.amount), `震波發數 = ${shockWaveSharing.shots} 發`, `單位金額 = ${shockWaveSharing.unitPrice}`],
        ],
      };
    },
    magneticWaveSharing: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '磁波分潤',
          amount: 0,
          details: [],
        };
      }
      const { magneticWaveSharing } = state.therapistSalaryDetail;
      return {
        label: '磁波分潤',
        amount: magneticWaveSharing.amount,
        details: [
          ['磁波時數 * 分潤單位', toCurrency(magneticWaveSharing.amount), `磁波時數 = ${magneticWaveSharing.hours} hr`, `分潤單位 = ${magneticWaveSharing.unitPrice}`],
        ],
      };
    },
    gChairSharing: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: 'G 動椅分潤',
          amount: 0,
          details: [],
        };
      }

      const { gChairSharing } = state.therapistSalaryDetail;
      return {
        label: 'G 動椅分潤',
        amount: gChairSharing.amount,
        details: [
          [
            'G 動椅時數 * 分潤單位',
            toCurrency(gChairSharing.amount),
            [
              `G 動椅總時數 = ${gChairSharing.hours.total} hr ( G動椅治療時數 ${gChairSharing.hours.therapy} hr + 轉介分潤時數 ${gChairSharing.hours.referral} hr )`,
              `分潤單位 = ${gChairSharing.unitPrice}`,
            ],
          ],
        ],
      };
    },
    SecondmentBonus: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '外派獎金',
          amount: 0,
          details: [],
        };
      }

      const { secondmentBonus } = state.therapistSalaryDetail;
      return {
        label: '外派獎金',
        amount: secondmentBonus.amount,
        details: [['外派獎金', '']],
      };
    },
    educationSharing: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '外派獎金',
          amount: 0,
          details: [],
        };
      }

      const { educationSharing } = state.therapistSalaryDetail;
      return {
        label: '教育分潤',
        amount: educationSharing.amount,
        details: [],
      };
    },

    educationSharingTable: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          columns: [],
          rows: [],
        };
      }

      const { educationSharing } = state.therapistSalaryDetail;
      return {
        columns: [
          {
            name: 'level',
            label: '關係（你 / 對象）',
            field: 'level',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'name',
            label: '對象',
            field: 'name',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'unitPrice',
            label: '執行價格',
            field: 'unitPrice',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'hours',
            label: '總執行數',
            field: 'hours',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'amount',
            label: '金額',
            field: 'amount',
            align: 'left',
          },
        ],
        rows: educationSharing.relationships.map((item) => {
          return {
            ...item,
            level: `${EducationMentorLevel[item.level]} / ${EducationApprenticeLevel[item.level]}`,
          };
        }),
      };
    },

    educationSharingRelationship: (state) => {
      if (!state.therapistSalaryDetail) {
        return {};
      }
      const userStore = useUserStore();
      const { educationSharing } = state.therapistSalaryDetail;

      return transformRelationshipsToTree(educationSharing.relationships, {
        content: {
          label: userStore.userInfo!.name,
          caption: '你',
        },
        level: 0,
      });
    },

    recommendationBonus: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '推薦獎金',
          amount: 0,
          details: [[]],
        };
      }

      const { recommendationBonus } = state.therapistSalaryDetail;
      return {
        label: '推薦獎金',
        amount: recommendationBonus.amount,
        details: [[]],
      };
    },

    recommendationBonusTable: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          columns: [],
          rows: [],
        };
      }

      const { recommendationBonus } = state.therapistSalaryDetail;
      return {
        columns: [
          {
            name: 'referral',
            label: '被推薦人',
            field: 'referral',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'bonus',
            label: '推薦獎金',
            field: 'bonus',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'caption',
            label: '',
            field: 'caption',
            align: 'left',
          },
        ],
        rows: recommendationBonus.recommendations.map((item) => {
          return {
            ...item,
            bonus: toCurrency(item.bonus),
            caption: `${RecommendationBonusType[item.type]} = ${toCurrency(item.bonus)}`,
          };
        }),
      };
    },

    writingBonus: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '推薦獎金',
          amount: 0,
          details: [],
        };
      }

      const { writingBonus } = state.therapistSalaryDetail;

      return {
        label: '寫作津貼',
        amount: writingBonus.amount,
        details: [['寫作津貼', '']],
      };
    },
    positionBonus: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '職務獎金',
          amount: 0,
          details: [],
        };
      }
      const userStore = useUserStore();
      const { positionBonus } = state.therapistSalaryDetail;

      if ([RoleType['副院長'], RoleType['物理治療師組長']].includes(userStore.role)) {
        return {
          label: '職務獎金',
          amount: positionBonus.amount,
          details: [['職務獎金', toCurrency(positionBonus.amount), `${RoleType[userStore.role]}職務獎金 = ${PositionBonusType[RoleType[userStore.role] as keyof typeof PositionBonusType]}`]],
        };
      }

      return {
        label: '職務獎金',
        amount: positionBonus.amount,
        details: [],
      };
    },

    positionBonusTable: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          columns: [],
          rows: [],
        };
      }

      const { positionBonus } = state.therapistSalaryDetail;

      if (!positionBonus) {
        return {
          columns: [],
          rows: [],
        };
      }

      const { condition } = positionBonus.performanceTarget;
      return {
        columns: [
          {
            name: 'performanceTarget',
            label: '考核目標',
            field: 'performanceTarget',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'totalExecutionGoal',
            label: '總執行數目標',
            field: 'totalExecutionGoal',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'revenueTarget',
            label: '總營收目標',
            field: 'revenueTarget',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'complaintRefundRate',
            label: '客訴與退費率',
            field: 'complaintRefundRate',
            align: 'left',
            style: 'width: 196px',
          },
          {
            name: 'greenLightRate',
            label: '綠燈率',
            field: 'greenLightRate',
            align: 'left',
            style: 'width: 196px',
          },
        ],
        rows: [
          {
            performanceTarget: '條件',
            totalExecutionGoal: `avg. ${condition.totalExecutionGoal} hr`,
            revenueTarget: `avg. ${condition.revenueTarget} K`,
            complaintRefundRate: `${condition.complaintRefundRate}%`,
            greenLightRate: `${condition.greenLightRate}%`,
          },
          {
            ...positionBonus.performanceTarget.status,
            performanceTarget: '狀態',
          },
        ],
      };
    },

    assistanceBonus: (state) => {
      if (!state.therapistSalaryDetail) {
        return {
          label: '支援獎金',
          amount: 0,
          details: [],
        };
      }
      const { assistanceBonus } = state.therapistSalaryDetail;

      return {
        label: '支援獎金',
        amount: assistanceBonus.amount,
        details: [['支援獎金', '']],
      };
    },

  },
  actions: {

    async getTherapistSalaryDetail(userId: number, yearMonth: string) {
      this.therapistSalaryDetail = await fetchTherapistSalaryDetail(userId, yearMonth);
    },

  },
});

function executionsToString(executions: { label: string; weight: number }[]) {
  return executions
    .map(execution => `（${execution.label} * 權重 ${execution.weight}）`)
    .join('+');
}
