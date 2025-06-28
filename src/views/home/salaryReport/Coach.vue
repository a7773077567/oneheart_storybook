<script setup lang="ts">
import { ExpansionItem, InfoHelp } from '@/components/home/salaryReport';
import { BasicTabs, MoneyDisplay } from '@/components/shared';
import { useUserStore } from '@/stores';
import { useSalaryReportCoachStore } from '@/stores/home/salaryReport/coach';
import { getMonthTabs } from '@/utils/salaryReport';
import { useQuasar } from 'quasar';
import { computed, reactive, watch } from 'vue';

const $q = useQuasar();
const coachSalaryStore = useSalaryReportCoachStore();
const userStore = useUserStore();
const monthTabs = getMonthTabs();

const state = reactive({
  currentTab: monthTabs[0].name,
  showAmount: false,
  educationSharingExpand: false,
});

watch(
  () => state.currentTab,
  async () => {
    $q.loading.show();
    try {
      await coachSalaryStore.getCoachSalaryDetail(
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
    coachSalaryStore.baseSalary,
    coachSalaryStore.performanceBonus,
    coachSalaryStore.spaceRental,
    coachSalaryStore.performanceChampion,
    coachSalaryStore.executionChampion,
    coachSalaryStore.quarterlyBonus,
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
        :amount="coachSalaryStore.totalAmount"
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
        <template v-if="item.label === '業績獎金'" #row-0="{ row }">
          <InfoHelp :infos="row.value[0].infos" :tooltip="row.value[0].executionString" show-help-icon />
        </template>

        <template v-else-if="item.label === '場租' && item.amount === 0" #row-0="{ row }">
          <InfoHelp :infos="row.value" />
        </template>

        <template v-else-if="item.label === '業績王' && item.amount === 0" #row-0="{ row }">
          <InfoHelp :infos="row.value" />
        </template>

        <template v-else-if="item.label === '執行王' && item.amount === 0" #row-0="{ row }">
          <InfoHelp :infos="row.value" />
        </template>

        <template v-else-if="item.label === '季獎金'" #row-0="{ row }">
          <InfoHelp :infos="row.value" />
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
</style>
