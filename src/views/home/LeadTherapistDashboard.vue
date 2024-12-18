<script setup lang="ts">
import { TherapistOverview } from '@/components/home/dashboard';
import { computed, ref, watch, watchEffect } from 'vue';
import { useShiftStore } from '@/stores';
import { useAdminStore } from '@/stores/home/dashboard/admin';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const shiftStore = useShiftStore();
const adminStore = useAdminStore();

$q.loading.show();
await adminStore.getTherapists();
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

watch([therapistSelect, therapistRangeSelect, therapistTypeSelect], async () => {
  $q.loading.show();
  await Promise.all([
    adminStore.getTherapistClientScheduleStatics({ userId: therapistSelect.value || undefined, dateRange: therapistRangeSelect.value }),
    adminStore.getTherapistOverviewStatistics({ userId: therapistSelect.value || undefined, userShiftTypes: therapistTypeSelect.value }),
    therapistSelect.value !== 0 && adminStore.getTherapistEducationPoint({ userId: therapistSelect.value }),
  ]);
  $q.loading.hide();
});
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
