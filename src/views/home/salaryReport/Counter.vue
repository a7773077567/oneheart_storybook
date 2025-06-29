<script setup lang="ts">
import { ExpansionItem, InfoHelp } from '@/components/home/salaryReport';
import { BasicTabs, CardTable, MoneyDisplay } from '@/components/shared';
import { useUserStore } from '@/stores';
import { useSalaryReportCounterStore } from '@/stores/home/salaryReport/counter';
import { getMonthTabs } from '@/utils/salaryReport';
import { useQuasar } from 'quasar';
import { computed, reactive, watch } from 'vue';
import { RouterLink } from 'vue-router';

const $q = useQuasar();
const counterSalaryStore = useSalaryReportCounterStore();
const userStore = useUserStore();
const monthTabs = getMonthTabs();

const state = reactive({
  currentTab: monthTabs[0].name,
  showAmount: false,
  currentSpaceTab: 0,
});

watch(
  () => state.currentTab,
  async () => {
    $q.loading.show();
    try {
      await counterSalaryStore.getCounterSalaryDetail(
        userStore.userInfo!.id,
        state.currentTab,
      );
    }
    catch (err) {
      console.error(err);
    }
    finally {
      $q.loading.hide();
    }
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
</script>

<template>
  <div class="details">
    <div class="details__header">
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
    </div>
    <div class="details__body">
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
              </CardTable>
            </div>
          </div>
        </template>
      </ExpansionItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: scroll;
  &__header {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 24px;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

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
</style>
