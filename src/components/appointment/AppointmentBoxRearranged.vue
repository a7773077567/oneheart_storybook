<script setup lang="ts">
import { createAppointment, createAppointmentRearrange } from '@/api/appointment';
import { useAppointmentStore } from '@/stores';
import { computed, ref } from 'vue';
import { getDateLabel, getTypeLabel } from '@/utils/mappers';
import { getDurationLabel } from '@/utils/date';
import { useRouter } from 'vue-router';

interface Column<T> {
  key?: keyof T;
  label: string;
  mapFunc?: (target: T) => string;
}

interface TableData {
  key: string;
  value: string;
}

const emit = defineEmits<{
  appointment: [];
  close: [];
}>();

const router = useRouter();
const appointmentStore = useAppointmentStore();
const isEmployeePrice = ref(false);
const client = computed(() => appointmentStore.targetClientScheduleNotStarted!.client);
const clientTableData = computed(() => getTableData(client.value, [
  { key: 'name', label: '姓名' },
  { key: 'phone', label: '電話' },
]));
const availableTableData = computed(() => getTableData(appointmentStore.targetAvailable, [
  { label: '日期', mapFunc: target => getDateLabel(target.date) },
  { label: '時間', mapFunc: target => getDurationLabel(target.startTime, target.endTime) },
  { label: '項目', mapFunc: target => `${getTypeLabel(target.type)}` },
  { label: '治療師', mapFunc: target => target.user.name },
]));
const phoneTableData = [
  { key: '會員電話', slotName: 'phone' },
];
const chooseTableData = [
  { key: '選擇會員', slotName: 'pick' },
];

function getTableData<T extends Record<string, any>>(target: T | null, columns: Column<T>[]): TableData[] {
  if (!target) {
    return [];
  }
  return columns.map(({ key, label, mapFunc }) => {
    const targetValue = target[key as keyof T];
    return {
      key: label,
      value: mapFunc ? mapFunc(target) : targetValue,
    };
  });
}

function close() {
  appointmentStore.resetTargetAppointmentState();
  emit('close');
}

async function appointment() {
  if (!appointmentStore.targetAvailable) {
    return;
  }

  const payload = {
    clientScheduleId: appointmentStore.targetClientScheduleNotStarted!.id,
    slotId: appointmentStore.targetAvailable.slotId,
    userShiftId: appointmentStore.targetAvailable.userShiftId,
  };
  await createAppointmentRearrange(payload);
  router.push({ name: 'appointmentCurrentQueryList' });
}
</script>

<template>
  <QCard style="width: 757px; min-height: 658px;">
    <QCardActions align="right" class="q-pa-none">
      <QIcon name="close" size="24px" class="cursor-pointer q-pa-sm" @click="close" />
    </QCardActions>
    <QCardSection class="column q-gutter-sm">
      <OCheckbox
        v-model="isEmployeePrice"
        label="員工價"
        left-label
        class="self-start q-pa-sm"
        disable
      />
      <OTable :data="phoneTableData">
        <template #phone>
          <div class="row justify-between items-center">
            <QInput :model-value="client.phone" disable dense hide-bottom-space borderless style="font-size: 18px;" />
            <QBtn label="查詢" disable outline dense padding="3px 26px" @click="appointmentStore.getClients" />
          </div>
        </template>
      </OTable>
      <OTable :data="chooseTableData">
        <template #pick>
          <div class="row items-center q-gutter-sm">
            <QBtn
              :label="client.name"
              class="active"
              outline dense padding="3px 26px"
              disable
            />
          </div>
        </template>
      </OTable>
      <span class="q-pa-sm">會員編號 {{ client.identityNumber || 1234567890 }} </span>
      <OTable :data="clientTableData" />
      <OTable :data="availableTableData" />
      <QBtn label="預約" class="self-end" outline dense padding="10px 46px" @click="appointment" />
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
.active {
  background-color: #000 !important;
  color: #fff;
}
</style>
