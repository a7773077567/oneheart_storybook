<script setup lang="ts">
import { RoleType } from '@/api';
import { revokeSalaryConfirmation } from '@/api/home/salaryReport/admin';
import { confirmCounterSalary } from '@/api/home/salaryReport/counter';
import { ConfirmChip, ExpansionItem, InfoHelp, Layout } from '@/components/home/salaryReport';
import { BasicBtn, BasicTabs, CardTable, MoneyDisplay } from '@/components/shared';
import { useDialog } from '@/composables/dialog';
import { useLoad } from '@/composables/load';
import { useUserStore } from '@/stores';
import { useSalaryReportCounterStore } from '@/stores/home/salaryReport/counter';
import { toCurrency } from '@/utils/helpers';
import { getMonthTabs } from '@/utils/salaryReport';
import dayjs from 'dayjs';
import { computed, reactive, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const userId = computed(() => route.query.employeeId as string);
const counterSalaryStore = useSalaryReportCounterStore();
const userStore = useUserStore();
const monthTabs = getMonthTabs();
const { load } = useLoad();

const state = reactive({
  currentTab: monthTabs[0].name,
  showAmount: false,
  currentSpaceTab: 0,
});

watch(
  [() => state.currentTab, () => userId.value],
  async () => {
    load(async () => {
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentTab,
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

async function confirmSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '薪資確認', message: `您的 ${dayjs(state.currentTab).format('M')} 月薪資為 ${toCurrency(counterSalaryStore.totalAmount)}。\n\n請確認您的薪資正確，點擊確認後將鎖定該薪資內容。` });
  onOk(async () => {
    load(async () => {
      await confirmCounterSalary({ yearMonth: state.currentTab });
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentTab,
      );
    });
  });
}

async function revokeSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '倒回確認', message: '倒回確認後，該人員需重新確認。' });
  onOk(async () => {
    load(async () => {
      await revokeSalaryConfirmation({ userId: +userId.value, yearMonth: state.currentTab });
      await counterSalaryStore.getCounterSalaryDetail(
        +userId.value,
        state.currentTab,
      );
    });
  });
}
</script>

<template>
  <Layout>
    <template #header>
      <BasicTabs
        v-model="state.currentTab"
        :tabs="monthTabs"
      />
      <MoneyDisplay
        v-model="state.showAmount"
        :dot-number="5"
        :amount="counterSalaryStore.totalAmount"
        label="薪資"
        visibility-toggle
      />

      <ConfirmChip />
      <BasicBtn v-if="RoleType[userStore.role] === '系統管理者'" icon="o_redo" label="倒回確認" style="justify-self: end;" @click="revokeSalary" />
      <BasicBtn v-else label="確認薪資" style="justify-self: end;" @click="confirmSalary" />
    </template>

    <template #body>
      <ExpansionItem
        v-for="(item, idx) in expansionItems"
        :key="idx"
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
            <RouterLink :to="{ name: '' }" class="anchor">查詢交易紀錄</RouterLink>
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
                      <li>實際執行情況請見 <span class="anchor">本季執行明細</span> 、 <span>本季銷售明細。</span></li>
                    </ul>
                  </div>
                </template>
              </CardTable>
            </div>
          </div>
        </template>
      </ExpansionItem>
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
