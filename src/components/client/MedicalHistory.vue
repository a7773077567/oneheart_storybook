<script setup lang="ts">
import { ShiftType, Types } from '@/const/general';
import { useClientStore } from '@/stores';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  clientId: string;
}>();

const clientStore = useClientStore();
const currentFilter = ref(0);

watchEffect(async () => {
  await clientStore.getMedicalHistory(
    +props.clientId,
    { userShiftTypes: currentFilter.value === 0
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      : [currentFilter.value],
    },
  );
});

const columns = [
  { name: 'date', field: 'date', label: '日期', align: 'left', style: 'width: 216px' },
  { name: 'typeName', field: 'typeName', label: '科別', align: 'left', style: 'width: 216px' },
  { name: 'chiefComplaint', field: 'chiefComplaint', label: '主訴', align: 'left' },
  { name: 'chevron', field: 'chevron', align: 'left', style: 'width: 48px' },
];

const rows = computed(() => {
  return clientStore.medicalHistory.map((history) => {
    const { date, userShiftType, chiefComplaint, clientScheduleId, scheduleStartTime, scheduleEndTime } = history;
    return {
      date: `${date} ${scheduleStartTime}-${scheduleEndTime}`,
      typeName: ShiftType[userShiftType],
      chiefComplaint,
      clientScheduleId,
    };
  });
});

function getFilterOptions() {
  const options = Object.values(Types).map(type => ({ label: type.label, value: type.identifier }));
  return [{ label: '所有科別', value: 0 }, ...options];
}
</script>

<template>
  <div class="medical-history">
    <div class="medical-history__header">
      <QSelect v-model="currentFilter" emit-value map-options outlined dense :options="getFilterOptions()" style="width: fit-content;" />
    </div>
    <div class="medical-history__body">
      <QTable :columns="columns" :rows="rows" separator="cell" hide-pagination flat bordered>
        <template #body-cell-chevron="tableProps">
          <QTd :props="tableProps">
            <QBtn icon="chevron_right" flat round @click="$router.push({ name: 'appointmentListInfo', params: { scheduleId: tableProps.row.clientScheduleId } })" />
          </QTd>
        </template>
      </QTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medical-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
