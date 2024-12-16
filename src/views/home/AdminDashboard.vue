<script setup lang="ts">
import { AdminTodayBusinessStatus, TherapistOverview } from '@/components/home/dashboard';
import { computed, ref, watchEffect } from 'vue';
import { useShiftStore } from '@/stores';
import { LineChart } from '@/components/shared';
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

watchEffect(async () => {
  $q.loading.show();
  const payload = therapistSelect.value === 0
    ? { dateRange: therapistRangeSelect.value }
    : { userId: therapistSelect.value, dateRange: therapistRangeSelect.value };
  await adminStore.getTherapistClientScheduleStatics(payload);
  $q.loading.hide();
});

watchEffect(async () => {
  $q.loading.show();
  const payload = therapistSelect.value === 0
    ? { userShiftTypes: therapistTypeSelect.value }
    : { userId: therapistSelect.value, userShiftTypes: therapistTypeSelect.value };
  await adminStore.getTherapistOverviewStatistics(payload);
  $q.loading.hide();
});

watchEffect(async () => {
  if (therapistSelect.value === 0)
    return;
  $q.loading.show();
  await adminStore.getTherapistEducationPoint({ userId: therapistSelect.value });
  $q.loading.hide();
});

// const lineLabels = ['1', '2', '3'];
// const lineData = [100, 200, 300];
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
    <!-- <LineChart :labels="lineLabels" :data="lineData" /> -->
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  > * {
    width: 1084px;
  }
}
</style>
