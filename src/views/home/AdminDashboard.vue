<script setup lang="ts">
import { AdminTodayBusinessStatus, TherapistClientGroup, TherapistOverview, TherapistTurnover } from '@/components/home/dashboard';
import { computed, ref, watch, watchEffect } from 'vue';
import { useShiftStore } from '@/stores';
import { useAdminStore } from '@/stores/home/dashboard/admin';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const shiftStore = useShiftStore();
const adminStore = useAdminStore();

$q.loading.show();
await Promise.all([
  adminStore.getTherapists(),
  adminStore.getTodayBusinessStatus(),
]);
$q.loading.hide();

const typeOptions = computed(() => shiftStore.spaceShiftOptions);
const therapistSelect = ref(0);
const therapistRangeSelect = ref('today');
const turnoverRangeSelect = ref('year');
const turnoverQueryTYpe = ref('');
const therapistTypeSelect = ref(typeOptions.value.map(option => option.value));
const hideEducationPoint = computed(() => therapistSelect.value === 0);
const educationPointModel = computed({
  get: () => adminStore.therapistEducationPoint,
  set: async ({ currentEducationPoint, predictedEducationPoint }) => {
    $q.loading.show();
    await adminStore.updateEducationPoint({
      userId: therapistSelect.value,
      currentEducationPoint,
      predictedEducationPoint,
    });
    await adminStore.getTherapistEducationPoint({ userId: therapistSelect.value });
    $q.loading.hide();
  },
});

watch([therapistSelect, therapistRangeSelect, therapistTypeSelect], async () => {
  $q.loading.show();
  await Promise.all([
    adminStore.getTherapistClientScheduleStatics({ userId: therapistSelect.value || undefined, dateRange: therapistRangeSelect.value }),
    adminStore.getTherapistOverviewStatistics({ userId: therapistSelect.value || undefined, userShiftTypes: therapistTypeSelect.value }),
    therapistSelect.value !== 0 && adminStore.getTherapistEducationPoint({ userId: therapistSelect.value }),
  ]);
  $q.loading.hide();
});

watchEffect(async () => {
  $q.loading.show();
  await adminStore.getTherapistTurnoverStatistics({ dateRange: turnoverRangeSelect.value });
  $q.loading.hide();
});

async function onClickPie(queryType: string) {
  turnoverQueryTYpe.value = queryType;
  await adminStore.getTherapistTurnoverStatisticsDetails({
    dateRange: turnoverRangeSelect.value,
    queryType,
    page: 1,
    take: 6,
  });
}

async function onDetailsRequest(props: Record<string, any>) {
  const { page, rowsPerPage } = props.pagination;
  await adminStore.getTherapistTurnoverStatisticsDetails({
    dateRange: turnoverRangeSelect.value,
    queryType: turnoverQueryTYpe.value,
    page,
    take: rowsPerPage,
  });
}

async function onGroupRequest(props: Record<string, any>) {
  const { page, rowsPerPage } = props.pagination;
  await adminStore.getTherapistClientGroupStatistics({
    page,
    take: rowsPerPage,
  });
}
</script>

<template>
  <div class="dashboard">
    <TherapistOverview
      v-model:therapistSelect="therapistSelect"
      v-model:rangeSelect="therapistRangeSelect"
      v-model:typeSelect="therapistTypeSelect"
      v-model:education-point="educationPointModel"
      :therapist-select-options="adminStore.therapistOptions"
      :type-select-options="typeOptions"
      :case-status="adminStore.caseStatistics"
      :checkout-plan="adminStore.checkoutPlanStatistics"
      :hide-education-point="hideEducationPoint"
      :overview="adminStore.therapistOverviewStatistics"
      :is-management="adminStore.roleQuery.isManagement"
    />

    <AdminTodayBusinessStatus
      :therapist-execution-hours="adminStore.therapistExecutionHoursStatistic"
      :new-and-return-statistic="adminStore.newAndReturnStatistic"
      :onetime-and-sessions-purchase="adminStore.onetimeAndSessionsPurchaseStatistic"
      :all-payments="adminStore.allPaymentStatistic"
    />
    <TherapistTurnover
      v-model="turnoverRangeSelect"
      v-model:details-pagination="adminStore.turnover.pagination"
      :line-chart-data="adminStore.turnoverLineChartData"
      :pie-chart-data="adminStore.turnoverPieChartData"
      :details-data="adminStore.turnoverDetailRows"
      @click-pie="onClickPie"
      @request="onDetailsRequest"
    />
    <TherapistClientGroup
      v-model:pagination="adminStore.clientGroup.pagination"
      :rows="adminStore.clientGroupRows"
      @request="onGroupRequest"
    />
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 100px;
  > * {
    width: 1084px;
  }
}
</style>
