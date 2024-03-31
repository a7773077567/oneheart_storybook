<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';
import { getType } from '@/utils/mappers';
import { computed } from 'vue';

interface Props {
  data: ClientSchedule;
  historyMode?: boolean;
}
const props = defineProps<Props>();
defineEmits<{
  cancel: [clientScheduleId: number];
  rearrange: [clientSchedule: ClientSchedule];
  restore: [clientScheduleId: number];
}>();

const scheduleState = new Map([
  [1, { label: '預約' }],
  [2, { label: '報到' }],
  [3, { label: '完成服務', bgc: '#D9D9D9', color: '#000000' }],
  [4, { label: '病歷完成' }],
  [5, { label: '取消預約', bgc: '#E86969', color: '#FFFFFF' }],
  [6, { label: '預約改期', bgc: '#91D0C1', color: '#FFFFFF' }],
  [7, { label: '刪除' }],
]);

const targetState = computed(() => scheduleState.get(props.data.state));
const showState = computed(() => props.historyMode);
const stateLabel = computed(() => targetState.value?.label);
const stateBgc = computed(() => targetState.value?.bgc);
const stateColor = computed(() => targetState.value?.color);
const showRecoveryBtn = computed(() => props.historyMode && props.data.isValidForRestore);
const showActions = computed(() => !props.historyMode || showRecoveryBtn.value);
const showRearrangeData = computed(() => props.historyMode && props.data.isBeenRearranged);

const currentData = computed(() => props.data.isBeenRearranged ? props.data.rearrangeClientSchedule! : props.data);
const tableData = new Map([
  ['日期', () => currentData.value.date],
  ['時間', () => `${currentData.value.scheduleStartTime}-${currentData.value.scheduleEndTime}`],
  ['客戶', () => currentData.value.client.name],
  ['科別', () => getType(currentData.value.userShift.type)],
  ['治療師', () => currentData.value.userShift.user.name],
]);

const rearrangeTableData = new Map([
  ['日期', () => props.data.date],
  ['時間', () => `${props.data.scheduleStartTime}-${props.data.scheduleEndTime}`],
  ['客戶', () => props.data.client.name],
  ['科別', () => getType(props.data.userShift.type)],
  ['治療師', () => props.data.userShift.user.name],
]);
</script>

<template>
  <div class="table">
    <div class="table__body">
      <div v-for="([key, getter], idx) in tableData.entries()" :key="idx" class="table__column">
        <div class="table__cell">
          {{ key }}
        </div>
        <div class="table__cell">
          {{ getter() }}
        </div>
      </div>
    </div>
    <div v-if="showState" class="table__state">
      {{ stateLabel }}
    </div>
    <div v-if="showRearrangeData" class="table__body">
      <div v-for="([, getter], idx) in rearrangeTableData.entries()" :key="idx" class="table__column">
        <div class="table__cell">
          {{ getter() }}
        </div>
      </div>
    </div>
    <div v-if="showActions" class="table__actions">
      <template v-if="!props.historyMode">
        <QBtn label="取消預約" outline rounded dense color="grey-9" padding="6px 9px" style="border-radius: 8px;" @click="$emit('cancel', data.id)" />
        <QBtn label="預約改期" outline rounded dense color="grey-9" padding="6px 9px" style="border-radius: 8px;" @click="$emit('rearrange', data)" />
      </template>
      <QBtn v-if="showRecoveryBtn" label="復原" outline rounded dense color="grey-9" padding="6px 23px" style="border-radius: 8px;" @click="$emit('restore', data.id)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__body {
    display: flex;
    font-size: 16px;
  }
  &__column {
    flex: 1 1 182px;
  }
  &__cell {
    padding: 5px;
    text-align: center;
    border: 1px solid #79747e;
    color: #333;
  }
  &__state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    border: 1px solid #79747e;
    font-size: 16px;
    font-weight: 600;
    color: v-bind('stateColor');
    background-color: v-bind('stateBgc');
  }
  &__actions {
    height: 51px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    border: 1px solid #79747e;
  }
}
</style>
