<script setup lang="ts">
import { CaseStatusMap, RangeSelectOptions } from '@/const/dashboard';
import { TherapistOverview } from '@/components/home/dashboard';
import { computed, ref } from 'vue';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';

const userStore = useUserStore();
const shiftStore = useShiftStore();
const appointmentStore = useAppointmentStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);

// Therapist Overview
const caseStatusData = Object.values(CaseStatusMap).reduce((acc: any, item, idx) => {
  acc.labels = [...(acc.label ?? []), item.label];
  acc.data = [...(acc.data ?? []), 5 + (idx * 3)];
  acc.backgroundColor = [...(acc.backgroundColor ?? []), item.color];
  return acc;
}, {});

const caseStatusInfoData = Object.values(CaseStatusMap).map((item, idx) => {
  const { color, label } = item;
  return {
    color,
    label,
    values: [
      `${5 + (idx * 3)}件`,
      `${+(((5 + (idx * 3)) / 55).toFixed(2)) * 100}%`,
    ],
  };
});

const caseStatus = computed(() => {
  return {
    title: '病例狀態',
    subtitle: '總時數 28 hr',
    chartData: caseStatusData,
    infoData: caseStatusInfoData,
  };
});

const typeOptions = computed(() => shiftStore.spaceShiftOptions);
const therapistSelect = ref(0);
const therapistRangeSelect = ref(0);

const therapistTypeSelect = ref(typeOptions.value.map(option => option.value));
const therapistSelectOptions = [
  {
    label: '所有治療師',
    value: 0,
  },
  ...appointmentStore.activeUsers,
];
</script>

<template>
  <div class="dashboard">
    <TherapistOverview
      v-model:therapistSelect="therapistSelect"
      v-model:rangeSelect="therapistRangeSelect"
      v-model:typeSelect="therapistTypeSelect"
      :therapist-select-options="therapistSelectOptions"
      :range-select-options="RangeSelectOptions"
      :type-select-options="typeOptions"
      :case-status="caseStatus"
      :checkout-plan="caseStatus"
    />
  </div>
</template>

<style lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
