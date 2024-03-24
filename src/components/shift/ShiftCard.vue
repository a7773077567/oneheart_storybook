<script setup lang="ts">
import type { ShiftTemplate } from '@/api/shift';
import { getDurationLabel } from '@/utils/date';

interface Props {
  data: ShiftTemplate;
}
defineProps<Props>();
defineEmits<{
  edit: [id: number];
  delete: [id: number];
}>();

// function getDurationLabel(startTime: string, endTime: string, isNotAvailableTime?: boolean) {
//   const [startHr] = startTime;
//   const [endHr] = endTime;

//   if (!isNotAvailableTime) {
//     return `${amOrPm(+startHr)}${startTime}-${amOrPm(+endHr)}${endTime}`;
//   }

//   return `${startTime}-${endTime}`;

//   function amOrPm(hr: number) {
//     return hr >= 12 ? '下午' : '上午';
//   }
// }
</script>

<template>
  <QCard>
    <QCardSection class="q-px-sm q-py-xs">
      <div class="text-h6">
        {{ data.name }}
      </div>
    </QCardSection>
    <QCardSection horizontal class="justify-between items-center q-px-sm">
      <QCardSection horizontal class="items-center q-gutter-md">
        <div class="text-body1 text-weight-medium">
          {{ getDurationLabel(data.startTime, data.endTime) }}
        </div>
        <QBadge v-for="(item, index) in data.notAvailableTimes" :key="index" color="grey-4" text-color="black" class="text-body2 ">
          {{ `不可預約時間${getDurationLabel(item.startTime, item.endTime, true)}` }}
        </QBadge>
      </QCardSection>
      <QCardActions class="q-pa-none">
        <QBtn label="編輯" dense unelevated outline style="width: 146px" @click="$emit('edit', data.id)" />
        <QBtn icon="o_delete" flat round @click="$emit('delete', data.id)" />
      </QCardActions>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
