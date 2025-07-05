<script setup lang="ts">
import { RoleType } from '@/api';
import { revokeSalaryConfirmation } from '@/api/home/salaryReport/admin';
import { confirmCounterSalary } from '@/api/home/salaryReport/counter';
import { ConfirmChip, DetailTable, ExpansionItem, InfoHelp, Layout } from '@/components/home/salaryReport';
import { BasicBtn, BasicDialog, BasicTabs, CardTable, MoneyDisplay } from '@/components/shared';
import { useDialog } from '@/composables/dialog';
import { useLoad } from '@/composables/load';
import { useUserStore } from '@/stores';
import { useSalaryReportCounterStore } from '@/stores/home/salaryReport/counter';
import { getMonthTabs } from '@/utils/salaryReport';
import dayjs from 'dayjs';
import type { QTableColumn } from 'quasar';
import { computed, reactive, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const userId = computed(() => route.query.employeeId as string);
const counterSalaryStore = useSalaryReportCounterStore();
const userStore = useUserStore();
const monthTabs = getMonthTabs();
const { load } = useLoad();

const state = reactive({
  currentMonth: monthTabs[3].name,
  showAmount: true,
  currentSpaceTab: 0,
  isExecutionsDetailDialogOpen: false,
  isSalesDetailDialogOpen: false,
});

const isSalaryConfirmed = computed(() => counterSalaryStore.counterSalaryDetail?.isConfirmed);
const currentSpaceId = computed(() => counterSalaryStore.counterSalaryDetail?.counterQuarterlyBonus[state.currentSpaceTab]?.space.id);
const currentSpaceName = computed(() => counterSalaryStore.counterSalaryDetail?.counterQuarterlyBonus[state.currentSpaceTab]?.space.name);
const lastSeasonString = computed(() => {
  const date = dayjs(state.currentMonth);
  const lastSeasonMonths = Array.from({ length: 3 }, (_, i) => date.subtract(i + 1, 'month'));
  const lastSeasonStartMonth = lastSeasonMonths[2].format('M');
  const lastSeasonEndMonth = lastSeasonMonths[0].format('M');
  const year = lastSeasonMonths[0].year();

  return `${year} 年 ${lastSeasonStartMonth}-${lastSeasonEndMonth} 月`;
});

watch(
  [() => state.currentMonth, () => userId.value],
  async () => {
    load(async () => {
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentMonth,
      );
    });
  },
  { immediate: true },
);

const expansionItems = computed(() => {
  return [
    counterSalaryStore.baseSalary,
    counterSalaryStore.profitShare,
    counterSalaryStore.quarterlyBonus,
  ];
});

const executionColumns: QTableColumn[] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'time', field: 'time', label: '時間', align: 'left' },
  { name: 'name', field: 'name', label: '客戶姓名', align: 'left' },
  { name: 'type', field: 'type', label: '項目', align: 'left' },
  { name: 'addOns', field: 'addOns', label: '加購服務', align: 'left', style: 'width: 232px' },
  { name: 'count', field: 'count', label: '執行數', align: 'left' },
  { name: 'btn', field: 'btn', label: '', align: 'left', style: 'width: 48px' },
];

const revenueColumns: QTableColumn[] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'clientId', field: 'clientId', label: '客戶編號', align: 'left' },
  { name: 'type', field: 'type', label: '項目', align: 'left' },
  { name: 'clientName', field: 'clientName', label: '客戶姓名', align: 'left' },
  { name: 'payMethod', field: 'payMethod', label: '付款方式', align: 'left', style: 'width: 232px' },
  { name: 'amount', field: 'amount', label: '堂數/金額', align: 'left' },
  { name: 'chargers', field: 'chargers', label: '負責人', align: 'left', style: 'width: 48px' },
];

async function confirmSalary() {
  const { onOk } = await useDialog({
    type: 'confirm',
    title: '薪資確認',
    subtitle: `謝謝您於本月份的辛勞與付出！`,
    message: `本月份薪資已按雙方契約及相關規章計算完成，詳如頁面所載，請您確認金額無誤。
您點擊「確定」後，該薪資金額即視為已確認無誤，並將依此金額發放，後續不得再提出異議。
同時，本頁面亦依法作為您的薪資明細（薪資單），請您自行留存備查。
如對金額有任何疑問，請於確認前與公司聯繫。`,
  });
  onOk(async () => {
    load(async () => {
      await confirmCounterSalary({ yearMonth: state.currentMonth });
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentMonth,
      );
    });
  });
}

async function revokeSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '倒回確認', message: '倒回確認後，該人員需重新確認。' });
  onOk(async () => {
    load(async () => {
      await revokeSalaryConfirmation({ userId: +userId.value, yearMonth: state.currentMonth });
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentMonth,
      );
    });
  });
}
</script>

<template>
  <Layout>
    <template #header>
      <BasicTabs
        v-model="state.currentMonth"
        :tabs="monthTabs"
      />
      <MoneyDisplay
        v-model="state.showAmount"
        :dot-number="5"
        :amount="counterSalaryStore.totalAmount"
        label="薪資"
        visibility-toggle
      />

      <ConfirmChip :done="isSalaryConfirmed" />
      <BasicBtn v-if="RoleType[userStore.role] === '系統管理者'" :disable="!isSalaryConfirmed" icon="o_redo" label="倒回確認" style="justify-self: end;" @click="revokeSalary">
        <QTooltip v-if="!isSalaryConfirmed" anchor="top left" :offset="[30, 36]" class="bg-black text-white">薪資已倒回，待人員重新確認</QTooltip>
      </BasicBtn>
      <BasicBtn v-else :disable="isSalaryConfirmed" label="確認薪資" style="justify-self: end;" @click="confirmSalary">
        <QTooltip v-if="isSalaryConfirmed" anchor="top left" :offset="[30, 36]" class="bg-black text-white">薪資已確認，若需倒回確認請聯繫系統管理員</QTooltip>
      </BasicBtn>
    </template>

    <template #body>
      <ExpansionItem
        v-for="(item, idx) in expansionItems"
        :key="idx"
        :model-value="true"
        :label="item.label"
        :amount="item.amount"
        :show-amount="state.showAmount"
        :details="item.details"
        :disable="!state.showAmount"
      >
        <template v-if="item.label === '儲值抽成'" #row-4="{ row }">
          <div class="row q-gutter-sm items-center profit-help">
            <span>{{ row.value[0] }}</span>
            <QIcon name="o_help_outline" size="20px" class="profit-help" />
            <QTooltip class="bg-black text-body-small" target=".profit-help" anchor="top left" :offset="[-100, 100]">
              <span style="white-space: pre-wrap;">{{ '儲值筆數對應抽成比例：\n0～5 筆抽成比例 1%\n6～10 筆抽成比例 1.5%\n11 筆以上抽成比例 2%' }}</span>
            </QTooltip>
          </div>
        </template>

        <template v-if="item.label === '儲值抽成'" #row-0="{ row }">
          <div class="row q-gutter-sm items-center">
            <InfoHelp :infos="row.value[0]" />
            <RouterLink :to="{ name: 'transactionRecords' }" class="anchor">查詢交易紀錄</RouterLink>
          </div>
        </template>

        <template v-else-if="item.label === '季獎金'" #row-0="{ row }">
          <InfoHelp :infos="row.value[0]" />
        </template>

        <template v-if="item.label === '季獎金' && counterSalaryStore.counterSalaryDetail?.counterQuarterlyBonus.length" #row-1="{ row }">
          <div class="quarterly">
            <div class="quarterly__tabs">
              <BasicTabs v-model="state.currentSpaceTab" :tabs="row.value[0].tabs" :tab-width="234" />
            </div>
            <div class="quarterly__title">
              <span v-for="(info, infoIdx) in row.value[0].bonusData[state.currentSpaceTab].titleInfo" :key="infoIdx">{{ info }}</span>
            </div>
            <div class="quarterly__body">
              <CardTable
                field-width="50%"
                :title="row.value[0].bonusData[state.currentSpaceTab].team.title"
                :data="row.value[0].bonusData[state.currentSpaceTab].team.data"
                value-align="flex-end"
              />
              <CardTable
                field-width="280px"
                :title="row.value[0].bonusData[state.currentSpaceTab].personal.title"
                :data="row.value[0].bonusData[state.currentSpaceTab].personal.data"
                value-align="flex-end"
              />
              <CardTable
                :title="row.value[0].bonusData[state.currentSpaceTab].commissionRate.title"
                :data="row.value[0].bonusData[state.currentSpaceTab].commissionRate.data"
                value-width="148px"
                style="grid-column: span 2;"
              >
                <template #grid-title>
                  <div class="grid-title">
                    <template
                      v-for="(gridItem, gridItemIdx) in row.value[0].bonusData[state.currentSpaceTab].commissionRate.gridTitle"
                      :key="gridItem"
                    >
                      <div
                        v-if="gridItemIdx !== 2 || gridItem.isUsed"
                        class="grid-title__item"
                      >
                        <div class="grid-title__label">{{ gridItem.label }}</div>
                        <div
                          class="grid-title__value"
                          :class="[gridItem.isPassed && 'passed', gridItem.isUsed && 'used']"
                        >
                          <span>{{ gridItem.value }}</span>
                          <QIcon v-if="!gridItem.isPassed && !gridItem.isUsed" name="info" size="20px" color="error" />
                        </div>
                      </div>
                    </template>
                  </div>
                </template>

                <template #caption>
                  <div class="caption">
                    <div class="caption__title">說明事項：</div>
                    <ul class="caption__list">
                      <li>{{ `註1：本季執行數標準（含射頻）= 治療師人數 ${row.value[0].bonusData[state.currentSpaceTab].commissionRate.caption.therapistCount}人 * 執行數單人標準。` }}</li>
                      <li>{{ `註2：本季銷售額標準（含儲值）= 本季應達成的銷售額 = 季執行數標準 * 均價 ${row.value[0].bonusData[state.currentSpaceTab].commissionRate.caption.averagePrice}。` }}</li>
                      <li>實際執行情況請見 <span class="anchor" @click="state.isExecutionsDetailDialogOpen = true">本季執行明細</span> 、 <span @click="state.isSalesDetailDialogOpen = true">本季銷售明細。</span></li>
                    </ul>
                  </div>
                </template>
              </CardTable>
            </div>
          </div>
        </template>
      </ExpansionItem>
      <BasicDialog
        v-if="state.isExecutionsDetailDialogOpen"
        v-model="state.isExecutionsDetailDialogOpen"
        title="本季執行明細（含射頻）"
      >
        <DetailTable
          :title="currentSpaceName"
          :sub-title="lastSeasonString"
          :request-func="counterSalaryStore.getExecutionClientScheduleList"
          :columns="executionColumns"
          :rows="counterSalaryStore.executionClientScheduleRows"
          :year-month="state.currentMonth"
          :user-id="+userId"
          :space-id="currentSpaceId"
        />
      </BasicDialog>
      <BasicDialog
        v-if="state.isSalesDetailDialogOpen"
        v-model="state.isSalesDetailDialogOpen"
        title="本季銷售明細（含儲值）"
      >
        <DetailTable
          :title="currentSpaceName"
          :sub-title="lastSeasonString"
          :request-func="counterSalaryStore.getRevenuePaymentList"
          :columns="revenueColumns"
          :rows="counterSalaryStore.revenuePaymentRows"
          :year-month="state.currentMonth"
          :user-id="+userId"
          :space-id="currentSpaceId"
        />
      </BasicDialog>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
.anchor {
  @include text-style($body-medium, $primary);
  font-weight: 700;
}

.quarterly {
  display: flex;
  flex-direction: column;
  gap: 28px;

  &__title {
    display: grid;
    grid-template-columns: 180px 240px 1fr;

    > span {
      @include text-style($label-large, $on-surface-variant);
      padding: 16px;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
  }
}

.grid-title {
  display: flex;
  gap: 16px;

  &__item {
    display: flex;
    gap: 4px;
  }

  &__label {
    @include text-style($body-medium, $on-surface-variant);
  }

  &__value {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    border-radius: 4px;
    background-color: #fce7e5;
    > span {
      @include text-style($body-medium, $on-surface-variant);
      color: $error;
    }

    &.passed {
      background-color: #c8eebf;
      > span {
        color: $on-surface-variant;
      }
    }

    &.used {
      background-color: #1a7ab3;
      > span {
        color: #fff;
      }
    }
  }
}

.caption {
  &__title {
    @include text-style($body-medium, $on-surface-variant);
  }

  &__list {
    list-style-type: disc;
    list-style-position: inside;
    padding-left: 8px;
  }
  li {
    @include text-style($body-medium, $on-surface-variant);
  }

  span {
    @include text-style($body-medium, $on-surface-variant);
    font-weight: 700;
    color: $primary;
    cursor: pointer;
  }
}
</style>
