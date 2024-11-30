<script setup lang="ts">
import type { GroupShiftTemplate, ShiftTemplate } from '@/api/shift';
import { getDurationLabel } from '@/utils/date';
import { computed } from 'vue';
import { ShiftType } from '@/const/general';

interface Props {
  data: ShiftTemplate | GroupShiftTemplate;
}

defineProps<Props>();

const isGroupClass = (data: ShiftTemplate | GroupShiftTemplate): data is GroupShiftTemplate => data.type === ShiftType.團課;
</script>

<template>
  <div
    class="shift-item"
  >
    <span class="shift-item__name">{{ data.name }}</span>
    <span class="shift-item__time">{{ data.startTime }} - {{ data.endTime }}</span>
    <span v-if="isGroupClass(data)" class="shift-item__note">
      團課排班數：
      <QChip size="sm" :color="data.scheduleClasses >= data.numberOfClasses ? 'black' : 'red'" text-color="white" class="q-ml-sm text-weight-medium">
        {{ data.scheduleClasses }}/{{ data.numberOfClasses }}
      </QChip>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.shift-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #515050;
  cursor: pointer;
  transition: 200ms ease;

  &__name {
    font-size: 16px;
    margin-right: 8px;
  }
  &__time {
    font-size: 16px;
    margin-right: 16px;
  }
  &__note {
    display: flex;
    align-items: center;
    margin-left: auto;
    :deep(.q-chip__content) {
      font-weight: 500;
      font-size: 11px;
    }
  }
}
</style>
