<script setup lang="ts">
import { TherapistOverview } from '@/components/home/dashboard';
import { computed, ref, watch, watchEffect } from 'vue';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import { LineChart } from '@/components/shared';
import { useAdminStore } from '@/stores/home/dashboard/admin';

const userStore = useUserStore();
const shiftStore = useShiftStore();
const appointmentStore = useAppointmentStore();
const adminStore = useAdminStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);

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
    await adminStore.updateEducationPoint({
      userId: therapistSelect.value,
      currentEducationPoint,
      predictedEducationPoint,
    });
    await adminStore.getTherapistEducationPoint({ userId: therapistSelect.value });
  },
});
watch(therapistSelect, async (newVal) => {
  if (newVal === 0) {
    hideEducationPoint.value = true;
    await adminStore.getTherapistClientScheduleStatics({ dateRange: therapistRangeSelect.value });
    return;
  }
  hideEducationPoint.value = false;
  await adminStore.getTherapistClientScheduleStatics({ userId: newVal, dateRange: therapistRangeSelect.value });
  await adminStore.getTherapistEducationPoint({ userId: newVal });
}, { immediate: true });

watchEffect(async () => {
  const payload = therapistSelect.value === 0
    ? { dateRange: therapistRangeSelect.value }
    : { userId: therapistSelect.value, dateRange: therapistRangeSelect.value };
  adminStore.getTherapistClientScheduleStatics(payload);
});

const lineLabels = ['1', '2', '3'];
const lineData = [100, 200, 300];
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
    />

    <LineChart :labels="lineLabels" :data="lineData" />
  </div>
</template>

<style lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
