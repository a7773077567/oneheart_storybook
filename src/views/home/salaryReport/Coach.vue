<script setup lang="ts">
import { RoleType } from '@/api';
import { revokeSalaryConfirmation } from '@/api/home/salaryReport/admin';
import { confirmCoachSalary } from '@/api/home/salaryReport/coach';
import { ConfirmChip, ExpansionItem, InfoHelp, Layout } from '@/components/home/salaryReport';
import { BasicBtn, BasicTabs, MoneyDisplay } from '@/components/shared';
import { useDialog } from '@/composables/dialog';
import { useLoad } from '@/composables/load';
import { useUserStore } from '@/stores';
import { useSalaryReportCoachStore } from '@/stores/home/salaryReport/coach';
import { toCurrency } from '@/utils/helpers';
import { getMonthTabs } from '@/utils/salaryReport';
import dayjs from 'dayjs';
import { computed, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = computed(() => route.query.employeeId as string);
const coachSalaryStore = useSalaryReportCoachStore();
const userStore = useUserStore();
const { load } = useLoad();
const monthTabs = getMonthTabs();

const state = reactive({
  currentTab: monthTabs[0].name,
  showAmount: false,
});

const isSalaryConfirmed = computed(() => coachSalaryStore.coachSalaryDetail?.isConfirmed);

watch(
  [() => state.currentTab, () => userId.value],
  async () => {
    load(async () => {
      await coachSalaryStore.getCoachSalaryDetail(
        +userId.value,
        state.currentTab,
      );
    });
  },
  { immediate: true },
);

const expansionItems = computed(() => {
  return userStore.userInfo?.isPartTime
    ? [coachSalaryStore.partTimeSalary]
    : [
        coachSalaryStore.baseSalary,
        coachSalaryStore.performanceBonus,
        coachSalaryStore.spaceRental,
        coachSalaryStore.performanceChampion,
        coachSalaryStore.executionChampion,
        coachSalaryStore.quarterlyBonus,
      ];
});

async function confirmSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '薪資確認', message: `您的 ${dayjs(state.currentTab).format('M')} 月薪資為 ${toCurrency(coachSalaryStore.totalAmount)}。\n\n請確認您的薪資正確，點擊確認後將鎖定該薪資內容。` });
  onOk(async () => {
    load(async () => {
      await confirmCoachSalary({ yearMonth: state.currentTab });
      await coachSalaryStore.getCoachSalaryDetail(
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
      await coachSalaryStore.getCoachSalaryDetail(
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
        :amount="coachSalaryStore.totalAmount"
        label="薪資"
        visibility-toggle
      />
      <ConfirmChip :done="isSalaryConfirmed" />
      <BasicBtn v-if="RoleType[userStore.role] === '系統管理者'" :disable="!isSalaryConfirmed" icon="o_redo" label="倒回確認" style="justify-self: end;" @click="revokeSalary">
        <QTooltip v-if="!isSalaryConfirmed" anchor="top left" :offset="[30, 36]" class="bg-black text-white">薪資已倒回，待人員重新確認</QTooltip>
      </BasicBtn>
      <BasicBtn v-else label="確認薪資" :disable="isSalaryConfirmed" style="justify-self: end;" @click="confirmSalary">
        <QTooltip v-if="isSalaryConfirmed" anchor="top left" :offset="[30, 36]" class="bg-black text-white">薪資已確認，若需倒回確認請聯繫系統管理員</QTooltip>
      </BasicBtn>
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
    </template>
  </Layout>
</template>

<style lang="scss" scoped>

</style>
