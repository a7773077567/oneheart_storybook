<script setup lang="ts">
import dayjs from 'dayjs';
import type { ShiftRes } from '@/api/shift';

interface Props {
  shift: ShiftRes;
}
defineProps<Props>();
defineEmits<{
  edit: [id: number];
  delete: [id: number];
}>();

function getLabel(duration: Record<string, any>, isUnavailable?: boolean) {
  const { startHr, startMin, endHr, endMin } = duration;
  const startTime = dayjs().set('h', startHr).set('m', startMin);
  const endTime = dayjs().set('h', endHr).set('m', endMin);
  if (!isUnavailable) {
    return `${amOrPm(startHr)}${startTime.format('hh:mm')}-${amOrPm(endHr)}${endTime.format('hh:mm')}`;
  }
  return `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;

  function amOrPm(hr: number) {
    return hr >= 12 ? '下午' : '上午';
  }
}
</script>

<template>
  <QCard>
    <QCardSection class="q-px-sm q-py-xs">
      <div class="text-h6">
        {{ shift.name }}
      </div>
    </QCardSection>
    <QCardSection horizontal class="justify-between items-center q-px-sm">
      <QCardSection horizontal class="items-center q-gutter-md">
        <div class="text-body1 text-weight-medium">
          {{ getLabel(shift.duration) }}
        </div>
        <QBadge v-for="(item, index) in shift.unavailable" :key="index" color="grey-4" text-color="black" class="text-body2 ">
          {{ `不可預約時間${getLabel(item, true)}` }}
        </QBadge>
      </QCardSection>
      <QCardActions class="q-pa-none">
        <QBtn label="編輯" dense unelevated outline style="width: 146px" @click="$emit('edit', shift.id)" />
        <QBtn icon="o_delete" flat round @click="$emit('delete', shift.id)" />
      </QCardActions>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
