<script setup lang="ts">
import type { Client } from '@/api';
import { createAppointment, createAppointmentRearrange } from '@/api/appointment';
import { useAppointmentStore } from '@/stores';
import { computed, ref } from 'vue';
import { getDateLabel, getType } from '@/utils/mappers';
import { getDurationLabel } from '@/utils/date';
import { useRouter } from 'vue-router';
import { OInput, OMemberSearch } from '@/components/shared';

interface Column<T> {
  key: keyof T | string;
  label: string;
  mapFunc?: (target: T) => string;
  slotName?: string;
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
const note = ref('');

const clientTableData = computed(() => getTableData(appointmentStore.targetClient, [
  { key: 'name', label: '姓名' },
  { key: 'phone', label: '電話' },
]));
const availableTableData = computed(() => getTableData(appointmentStore.targetAvailable, [
  { key: 'date', label: '日期', mapFunc: target => getDateLabel(target.date) },
  { key: 'startTime', label: '時間', mapFunc: target => getDurationLabel(target.startTime, target.endTime) },
  { key: 'name', label: '項目', mapFunc: target => `${getType(target.type)}` },
  { key: 'user', label: '治療師', mapFunc: target => target.user.name },
  { key: 'note', label: '備註', slotName: 'note' },
]));

function getTableData<T extends Record<string, any>>(target: T | null, columns: Column<T>[]): TableData[] {
  if (!target) {
    return [];
  }
  return columns.map(({ key, label, mapFunc, slotName }) => {
    const targetValue = target[key as keyof T];
    return {
      key: label,
      value: mapFunc ? mapFunc(target) : targetValue,
      ...(slotName && { slotName }),
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
    await createAppointment({
      isEmployeePrice: isEmployeePrice.value,
      slotId: appointmentStore.targetAvailable.slotId ?? null,
      userShiftId: appointmentStore.targetAvailable.userShiftId,
      bookingClientIds: [appointmentStore.targetClient.id],
      note: note.value ?? '',
    });
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

// to refactor, need to get clients first
appointmentStore.getClients();
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
      <OMemberSearch v-model="pickedClientId" placeholder="電話或姓名搜尋會員" @full-info="appointmentStore.targetClient = $event" />
      <template v-if="appointmentStore.targetClient">
        <span class="q-pa-sm">會員編號 {{ appointmentStore.targetClient.identityNumber || 1234567890 }} </span>
        <OTable :data="clientTableData" />
        <OTable :data="availableTableData">
          <template #note>
            <OInput v-model="note" name="note" hide-bottom-space type="textarea" class="full-width" placeholder="請輸入預約備註" />
          </template>
        </OTable>
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
