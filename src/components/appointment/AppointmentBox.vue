<script setup lang="ts">
import type { Client } from '@/api/appointment';
import { createAppointment, createAppointmentRearrange } from '@/api/appointment';
import { useAppointmentStore } from '@/stores';
import { computed, ref } from 'vue';
import { getDateLabel } from '@/utils/mappers';
import { getDurationLabel } from '@/utils/date';
import { useRouter } from 'vue-router';

interface Column<T> {
  key: keyof T;
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
const pickedClientId = ref<number | null>(null);
const clientTableData = computed(() => getTableData(appointmentStore.targetClient, [
  { key: 'name', label: '姓名' },
  { key: 'phone', label: '電話' },
]));
const availableTableData = computed(() => getTableData(appointmentStore.targetAvailable, [
  { key: 'date', label: '日期', mapFunc: target => getDateLabel(target.date) },
  { key: 'startTime', label: '時間', mapFunc: target => getDurationLabel(target.startTime, target.endTime) },
  { key: 'name', label: '項目' },
  { key: 'user', label: '治療師', mapFunc: target => target.user.name },
]));
const phoneTableData = [
  { key: '會員電話', value: '0900-000-011', slotName: 'phone' },
];
const chooseTableData = [
  { key: '選擇會員', slotName: 'pick' },
];

function pickClient(client: Client) {
  pickedClientId.value = client.id;
  appointmentStore.targetClient = appointmentStore.clients.find(client => client.id === pickedClientId.value)!;
}

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
  if (!appointmentStore.targetAvailable || !appointmentStore.targetClient) {
    return;
  }
  if (!appointmentStore.rearrangeMode) {
    const payload = {
      isEmployeePrice: isEmployeePrice.value,
      slotId: appointmentStore.targetAvailable.slotId ?? null,
      userShiftId: appointmentStore.targetAvailable.userShiftId,
      bookingClientId: appointmentStore.targetClient.id,
    };
    await createAppointment(payload);
    await appointmentStore.getAvailable(appointmentStore.availableQuery!);
  }
  else {
    const payload = {
      clientScheduleId: appointmentStore.targetClientScheduleNotStarted!.id,
      slotId: appointmentStore.targetAvailable.slotId,
      userShiftId: appointmentStore.targetAvailable.userShiftId,
    };
    await createAppointmentRearrange(payload);
    router.push({ name: 'appointmentCurrentQueryList' });
    return;
  }
  appointmentStore.resetTargetAppointmentState();
  emit('appointment');
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
      />
      <OTable :data="phoneTableData">
        <template #phone>
          <div class="row justify-between items-center">
            <QInput v-model="appointmentStore.clientPhone" dense hide-bottom-space borderless style="font-size: 18px;" />
            <QBtn label="查詢" outline dense padding="3px 26px" @click="appointmentStore.getClients" />
          </div>
        </template>
      </OTable>
      <OTable v-if="appointmentStore.clients.length" :data="chooseTableData">
        <template #pick>
          <div class="row items-center q-gutter-sm">
            <QBtn
              v-for="(client, idx) in appointmentStore.clients"
              :key="idx"
              :label="client.name"
              :class="{ active: pickedClientId === client.id }"
              outline dense padding="3px 26px"
              @click="() => pickClient(client)"
            />
          </div>
        </template>
      </OTable>
      <template v-if="appointmentStore.targetClient">
        <span class="q-pa-sm">會員編號 {{ appointmentStore.targetClient.identityNumber || 1234567890 }} </span>
        <OTable :data="clientTableData" />
        <OTable :data="availableTableData" />
        <QBtn label="預約" class="self-end" outline dense padding="10px 46px" @click="appointment" />
      </template>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
.active {
  background-color: #000 !important;
  color: #fff;
}
</style>
