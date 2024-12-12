<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type CoachAppointment, type CoachOperationGoal, type CoachStatistics, type CoachStatisticsDateRange, getCoachAppointmentList, getCoachOperationGoal, getCoachStatistics } from '@/api';
import { OptionSelect, SwitchBtn } from '@/components/shared';
import { QSeparator } from 'quasar';
import type { QTableProps } from 'quasar';
import OperationGoal, { type Goal } from '@/components/home/dashboard/OperationGoal.vue';

const filterTime = ref<CoachStatisticsDateRange>('month');
const trainer = ref<null | number>(0);
const trainerOptions = computed(() => [{ label: '所有教練', value: 0 }]);

const ifShowAll = ref(false);
const statics = ref<CoachStatistics>({
  totalAppointments: 0,
  paidOrders: 0,
  totalAmount: 0,
  allPaymentStatistic: [],
});
const appointmentList = ref<CoachAppointment[]>([]);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

interface CoachGoal {
  user: {
    name: string;
    id: number;
  };
  list: Goal[];
}
const operationGoalList = ref<CoachGoal[]>([]);
const timeOptions = [{ label: '本日', value: 'today' }, { label: '本月', value: 'month' }];

await Promise.allSettled([
  getStatics(),
  getAppointmentList(),
  getOperationGoals(),
]);

async function getStatics() {
  statics.value = await getCoachStatistics({ dateRange: filterTime.value });
}
async function getOperationGoals(targetId?: number) {
  const allGoals = await getCoachOperationGoal(targetId);
  const list = allGoals.reduce<CoachGoal[]>((goalList, perQ) => {
    if (goalList.some(p => p.user.id === perQ.user.id)) {
      const t = goalList.find(p => p.user.id === perQ.user.id);
      if (t) {
        t.list.push({
          quarter: perQ.quarter,
          current: perQ.currentOrder,
          goal: perQ.targetOrder,
        });
      }
    }
    else {
      const { user, ...goalData } = perQ;
      goalList.push({
        user,
        list: [{
          quarter: goalData.quarter,
          current: goalData.currentOrder,
          goal: goalData.targetOrder,
        }],
      });
    }
    return goalList;
  }, []);
  operationGoalList.value = list;
}

async function getAppointmentList() {
  const { data, meta } = await getCoachAppointmentList({ dateRange: filterTime.value, page: pagination.value.page });
  appointmentList.value = data;
  pagination.value = {
    ...pagination.value,
    page: meta?.page ?? 1,
    rowsNumber: meta?.take ?? 1,
  };
}

// list
const columns: QTableProps['columns'] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'scheduleStartTime', field: 'scheduleStartTime', label: '時間', align: 'left', format: (val, row) => `${val} - ${row.scheduleEndTime}` },
  { name: 'client', field: 'client', label: '客戶', align: 'left', format: val => val?.name },
  { name: 'record', field: 'record', label: '運動建議', align: 'left', format: val => val?.coachAdvice },
  { name: 'remainingTotalCoachClassPoints', field: 'remainingTotalCoachClassPoints', label: '剩餘運動堂數', align: 'left' },
  { name: 'details', field: 'details', label: '病歷單', align: 'left', style: 'width: 40px' },
];
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <h2 class="title">教練運營總覽</h2>
      <OptionSelect v-model="trainer" :options="trainerOptions" />
    </div>
    <div class="overview__content">
      <div class="statics">
        <section class="statics_number column">
          <div class="title">
            <h3>現況概覽</h3>
            <SwitchBtn v-model="filterTime" :options="timeOptions" />
          </div>
          <div class="content row">
            <div class="col">
              <ul class="list column full-height">
                <li class="list_item">
                  <div class="list_item--label">總預約單數</div>
                  <div class="list_item--val">{{ statics.totalAppointments }} 件</div>
                </li>
                <li class="list_item">
                  <div class="list_item--label">已結帳數</div>
                  <div class="list_item--val">{{ statics.paidOrders }} 件</div>
                </li>
                <li class="list_item">
                  <div class="list_item--label">交易金額</div>
                  <div class="list_item--val">$ {{ statics.totalAmount }}</div>
                </li>
              </ul>
            </div>
            <QSeparator vertical class="q-mx-lg" />
            <div class="col">
              <ul class="list column full-height" :class="ifShowAll ? 'overflow-auto' : 'overflow-hidden'">
                <li v-for="counts in statics.allPaymentStatistic" :key="counts.label" class="list_item">
                  <div class="list_item--label">{{ counts.label }}</div>
                  <div class="list_item--val">{{ counts.value }} 件</div>
                </li>
                <li class="list_item">
                  <div class="list_item--label">已結帳數</div>
                  <div class="list_item--val">12件</div>
                </li>
                <li class="list_item">
                  <div class="list_item--label">交易金額</div>
                  <div class="list_item--val">$16,000</div>
                </li>
                <div v-if="statics.allPaymentStatistic.length > 4 || !ifShowAll" class="q-mt-auto">
                  <QSeparator />
                  <div class="q-py-sm show_all_btn flex items-center" @click="ifShowAll = true">
                    <span>展開全部</span>
                    <QIcon name="arrow_drop_down" size="24px" />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </section>
        <QSeparator class="q-mx-md" />
        <section class="statics_list column">
          <h4 class="title">預約列表</h4>
          <div>
            <QTable
              v-model:pagination="pagination"
              flat
              :columns="columns"
              :rows="appointmentList"
              row-key="id"
              bordered separator="cell"
              :rows-per-page-options="[10, 20, 50]"
            >
              <template #body-cell-details="props">
                <QTd :props="props">
                  <QBtn
                    icon="chevron_right" flat round @click="$router.push({ name: 'appointmentListInfo', params: { scheduleId: props.row.id } })"
                  />
                </QTd>
              </template>
            </QTable>
          </div>
        </section>
      </div>
      <aside class="operation_goal column">
        <h3 class="title">運營目標</h3>
        <div class="column">
          <div v-for="personGoal in operationGoalList" :key="personGoal.user.id">
            <h4 v-if="operationGoalList.length > 1">{{ personGoal.user.name }}</h4>
            <OperationGoal :list="personGoal.list" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      font-weight: 500;
    }
  }

  &__content {
    flex: 1;
    border: 1px solid #dbdae7;
    border-radius: 16px;
    overflow: hidden;
  }
}

.overview__content {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  .statics {
    flex: 1 1 400px;
    // max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &_number {
      padding: 16px 24px 24px;
      flex: 0 1 240px;
      .title {
        padding: 4px 0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .content {
        flex: 1;
      }
      .list {
        overflow: auto;
      }
      .list_item + .list_item {
        margin-top: 12px;
      }
      .list_item {
        display: flex;
        justify-content: space-between;
        &--label {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          letter-spacing: 0.1px;
        }
        &--val {
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.15px;
        }
      }
    }
    &_list {
      padding: 16px 24px 12px;
      flex: 1;
      overflow: auto;
    }
    .show_all_btn {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      cursor: pointer;
    }
  }

  .statics_list {
    .title {
      margin-bottom: 18px;
    }
    .q-table__container {
      flex: 1;
    }
  }

  .operation_goal {
    overflow: auto;
    width: 400px;
    flex: 0 1 400px;
    background: #eff4fb;
    padding: 24px;
    border-left: 1px solid #dbdae7;
    .title {
      margin-bottom: 16px;
    }
    .q-list {
      overflow: auto;
    }
  }

  h3 {
    font-size: 22px;
    font-weight: 500;
  }

  h4 {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
