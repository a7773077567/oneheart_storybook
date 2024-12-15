<script setup lang="ts">
import { AdminTodayBusinessStatus, TherapistOverview } from '@/components/home/dashboard';
import { computed, ref, watch, watchEffect } from 'vue';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import { LineChart } from '@/components/shared';
import { useAdminStore } from '@/stores/home/dashboard/admin';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const userStore = useUserStore();
const shiftStore = useShiftStore();
const appointmentStore = useAppointmentStore();
const adminStore = useAdminStore();
$q.loading.show();
await Promise.all([
  appointmentStore.getUsers([userStore.currentSpaceId!]),
  adminStore.getTodayBusinessStatus(),
]);
$q.loading.hide();

const typeOptions = computed(() => shiftStore.spaceShiftOptions);
const therapistSelect = ref(0);
const therapistRangeSelect = ref('today');
const hideEducationPoint = ref(false);
const therapistTypeSelect = ref(typeOptions.value.map(option => option.value));
const therapistSelectOptions = [
  { label: '所有治療師', value: 0 },
  ...appointmentStore.activeUsers,
];

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
    $q.loading.show();
  },
});

watch(therapistSelect, async (newVal) => {
  if (newVal === 0) {
    $q.loading.show();
    hideEducationPoint.value = true;
    await adminStore.getTherapistClientScheduleStatics({ dateRange: therapistRangeSelect.value });
    $q.loading.hide();
    return;
  }
  hideEducationPoint.value = false;
  $q.loading.show();
  await Promise.all([
    adminStore.getTherapistClientScheduleStatics({ userId: newVal, dateRange: therapistRangeSelect.value }),
    adminStore.getTherapistEducationPoint({ userId: newVal }),
    adminStore.getTherapistOverviewStatistics({ userId: newVal, userShiftTypes: therapistTypeSelect.value }),
  ]);
  $q.loading.hide();
}, { immediate: true });

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
      :therapist-select-options="therapistSelectOptions"
      :type-select-options="typeOptions"
      :case-status="adminStore.caseStatistics"
      :checkout-plan="adminStore.checkoutPlanStatistics"
      :hide-education-point="hideEducationPoint"
      :overview="adminStore.therapistOverviewStatistics"
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
