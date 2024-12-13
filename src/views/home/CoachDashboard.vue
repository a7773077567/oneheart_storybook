<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { type CoachAppointment, type CoachOperationGoal, type CoachStatistics, type CoachStatisticsDateRange, RoleType, fetchUsers, getCoachAppointmentList, getCoachOperationGoal, getCoachStatistics, updateCoachOperationGoal } from '@/api';
import { OptionSelect, SwitchBtn } from '@/components/shared';
import { QSeparator } from 'quasar';
import type { QTableProps } from 'quasar';
import OperationGoal, { type Goal } from '@/components/home/dashboard/OperationGoal.vue';
import EditGoalForm, { type QuarterGoal } from '@/components/home/dashboard/EditGoalForm.vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const isLoading = ref(false);
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

// filters
const filterTime = ref<CoachStatisticsDateRange>('month');
const timeOptions = [{ label: '本日', value: 'today' }, { label: '本月', value: 'month' }];
const userId = ref<number>(0);
const trainerOptions = ref<{ label: string; value: number }[]>([]);

// static list
const ifShowAll = ref(false);
const displayPaymentStaticList = computed(() => ifShowAll.value ? statics.value.allPaymentStatistic : statics.value.allPaymentStatistic.filter((_, i) => i < 4));

getData();
async function getData() {
  if (userStore.canI('EDIT_COACH_OPERATION_TARGET')) {
    userId.value = 0;
  }
  else {
    userId.value = userStore!.userInfo!.id;
  }
  await Promise.allSettled([
    getStatics(),
    getAppointmentList(),
    getOperationGoals(),
    ...(userStore.canI('EDIT_COACH_OPERATION_TARGET') ? [getCoachList()] : []),
  ]);
}

async function getStatics() {
  statics.value = await getCoachStatistics({ dateRange: filterTime.value, userId: userId.value || undefined });
}
async function getOperationGoals() {
  const allGoals = await getCoachOperationGoal(userId.value || undefined);
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
  const { data, meta } = await getCoachAppointmentList({
    dateRange: filterTime.value,
    userId: userId.value || undefined,
    page: pagination.value.page,
    take: pagination.value.rowsPerPage,
  });
  appointmentList.value = data;
  pagination.value = {
    ...pagination.value,
    page: meta?.page ?? 1,
    rowsNumber: meta?.pageCount ?? 1,
    rowsPerPage: meta?.take ?? 10,
  };
}

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;

  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getAppointmentList();
};

async function getCoachList() {
  const data = await fetchUsers({ roleTypes: [RoleType['教練組長'], RoleType['教練']] });
  trainerOptions.value = [
    { label: '所有教練', value: 0 },
    ...data.map(p => ({ label: p.name, value: p.id })),
  ];
}

// list
const columns: QTableProps['columns'] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'scheduleStartTime', field: 'scheduleStartTime', label: '時間', align: 'left', format: (val, row) => `${val} - ${row.scheduleEndTime}` },
  { name: 'client', field: 'client', label: '客戶', align: 'left', format: val => val?.name },
  { name: 'record', field: 'record', label: '運動建議', align: 'left', format: val => val?.forClient, style: 'max-width:120px; text-overflow:ellipsis; word-break:break-all; overflow:hidden' },
  { name: 'remainingTotalCoachClassPoints', field: 'remainingTotalCoachClassPoints', label: '剩餘運動堂數', align: 'center' },
  { name: 'details', field: 'details', label: '病歷單', align: 'left', style: 'width: 40px' },
];

// operation goal
const showGoalEdit = ref(false);
const selectedGoalData = ref();
const isGoalDataLoading = ref(false);

async function updateGoal(data: QuarterGoal) {
  isGoalDataLoading.value = true;
  showGoalEdit.value = false;
  await updateCoachOperationGoal({ userId: data.client.id, quarter: data.quarter, targetCount: data.current });
  await getOperationGoals();
  isGoalDataLoading.value = false;
}

watch(() => [userId, filterTime], async () => {
  isLoading.value = true;
  isGoalDataLoading.value = true;
  await Promise.allSettled([
    getStatics(),
    getAppointmentList(),
    getOperationGoals(),
    getCoachList(),
  ]);
  isLoading.value = false;
  isGoalDataLoading.value = false;
}, {
  deep: true,
});
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <h2 class="title">教練運營總覽</h2>
      <template v-if="userStore.canI('EDIT_COACH_OPERATION_TARGET')">
        <OptionSelect v-model="userId" :options="trainerOptions" />
      </template>
    </div>
    <div class="overview__content">
      <div class="statics">
        <section class="statics_number column">
          <div class="title">
            <h3>現況概覽</h3>
            <SwitchBtn v-model="filterTime" :options="timeOptions" />
          </div>
          <div v-if="isLoading" class="flex justify-center items-center full-width">
            <QSpinner
              color="primary"
              size="2em"
            />
          </div>
          <template v-else>
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
                    <div>
                      <span class="list_item--label">交易金額</span>
                      <p class="note">不含堂數及功能性團課</p>
                    </div>
                    <div class="list_item--val">$ {{ statics.totalAmount }}</div>
                  </li>
                </ul>
              </div>
              <QSeparator vertical class="q-mx-lg" />
              <div class="col">
                <div class="column full-height">
                  <ul class="list" :class="ifShowAll ? 'overflow-auto' : 'overflow-hidden'">
                    <li v-for="counts in displayPaymentStaticList" :key="counts.label" class="list_item">
                      <div class="list_item--label">{{ counts.label }}</div>
                      <div class="list_item--val">{{ counts.value }} 件</div>
                    </li>
                  </ul>
                  <div v-if="statics.allPaymentStatistic.length > 4 && !ifShowAll" class="q-mt-auto">
                    <QSeparator />
                    <div class="q-py-sm show_all_btn flex items-center" @click="(ifShowAll = true), (statics.allPaymentStatistic = statics.allPaymentStatistic)">
                      <span>展開全部</span>
                      <QIcon name="arrow_drop_down" size="24px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </section>
        <QSeparator class="q-mx-md" />
        <section class="statics_list">
          <h4 class="title">預約列表</h4>
          <div v-if="isLoading" class="flex justify-center items-center full-height">
            <QSpinner
              color="primary"
              size="2em"
            />
          </div>
          <div v-else>
            <QTable
              v-model:pagination="pagination"
              flat
              :columns="columns"
              :rows="appointmentList"
              row-key="id"
              separator="horizontal"
              rows-per-page-label="每頁顯示筆數"
              :pagination-label="(start:number, end:number, total:number) => `${start}-${end}筆（共${total}筆）`"
              :rows-per-page-options="[10, 20, 50]"
              @request="onRequest"
            >
              <template #body-cell-record="props">
                <QTd :props="props">
                  <p :style="props.col.style">{{ props.value }}</p>
                  <QTooltip v-if="props.value" class="bg-black text-white q-px-sm q-py-xs text-caption" anchor="center right" self="bottom middle" max-width="240px" max-height="160px">
                    {{ props.value }}
                  </QTooltip>
                </QTd>
              </template>
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
      <aside class="operation_goal">
        <h3 class="title">運營目標</h3>
        <div v-if="isGoalDataLoading" class="flex items-center justify-center full-height">
          <QSpinner
            color="primary"
            size="2em"
          />
        </div>
        <template v-else>
          <div class="column">
            <div v-for="personGoal in operationGoalList" :key="personGoal.user.id">
              <h4 v-if="operationGoalList.length > 1" class="q-mb-sm">{{ personGoal.user.name }}</h4>
              <OperationGoal :read-only="!userStore.canI('EDIT_COACH_OPERATION_TARGET')" :list="personGoal.list" @edit="(selectedGoalData = { quarter: $event.quarter, current: $event.goal, client: personGoal.user }), showGoalEdit = true" />
              <QSeparator class="q-my-md full-width" />
            </div>
          </div>
        </template>
      </aside>
    </div>
  </div>
  <QDialog v-model="showGoalEdit">
    <EditGoalForm v-bind="selectedGoalData" @save="updateGoal" @cancel="showGoalEdit = false" />
  </QDialog>
</template>

<style scoped lang="scss">
.overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  display: block;
  overflow: auto;

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .statics {
    flex: 1 1 auto;
    display: block;
    min-height: fit-content;
    @media (min-width: 1200px) {
      overflow: hidden;
      max-height: 100%;
      display: flex;
      flex-direction: column;
    }
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
        max-height: 200px;
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
        .note {
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
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
    background: #eff4fb;
    padding: 24px;
    border-left: 1px solid #dbdae7;

    @media (min-width: 1200px) {
      flex: 0 1 400px;
      overflow: auto;
      width: 400px;
    }
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
