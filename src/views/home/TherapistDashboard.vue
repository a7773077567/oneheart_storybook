<script setup lang='ts'>
import { TherapistOverview } from '@/components/home/dashboard';
import { computed, ref, watch, watchEffect } from 'vue';
import { useShiftStore, useUserStore } from '@/stores';
import { useAdminStore } from '@/stores/home/dashboard/admin';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const shiftStore = useShiftStore();
const adminStore = useAdminStore();
const userStore = useUserStore();
const therapistSelect = ref(userStore.userInfo?.id ?? 0);

await adminStore.getTherapistEducationPoint({ userId: adminStore.userId });

const typeOptions = computed(() => shiftStore.spaceShiftOptions);
const therapistTypeSelect = ref(typeOptions.value.map(option => option.value));
const therapistRangeSelect = ref('today');

const educationPointModel = computed({
  get: () => adminStore.therapistEducationPoint,
  set: async ({ currentEducationPoint, predictedEducationPoint }) => {
    $q.loading.show();
    await adminStore.updateEducationPoint({
      userId: adminStore.userId,
      currentEducationPoint,
      predictedEducationPoint,
    });
    await adminStore.getTherapistEducationPoint({ userId: adminStore.userId });
    $q.loading.hide();
  },
});

watch([therapistSelect, therapistRangeSelect, therapistTypeSelect], async () => {
  $q.loading.show();

  await Promise.all([
    adminStore.getTherapistClientScheduleStatics({ userId: therapistSelect.value || undefined, dateRange: therapistRangeSelect.value }),
    adminStore.getTherapistOverviewStatistics({ userId: therapistSelect.value || undefined, userShiftTypes: therapistTypeSelect.value }),
    adminStore.getTherapistTrafficLight({ userId: therapistSelect.value }),
  ]);
  $q.loading.hide();
}, {
  immediate: true,
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
      :overview="adminStore.therapistOverviewStatistics"
      :is-management="adminStore.roleQuery.isManagement"
      :traffic-light-overview="adminStore.targetTherapistTrafficLight"
    />
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  > * {
    width: 1084px;
  }
}
</style>
