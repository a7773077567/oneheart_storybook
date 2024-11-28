<script setup lang="ts">
import type { GroupShiftTemplate } from '@/api/shift';
import { getDurationLabel } from '@/utils/date';

interface Props {
  data: GroupShiftTemplate;
}
defineProps<Props>();
defineEmits<{
  edit: [id: number];
  delete: [id: number];
}>();
</script>

<template>
  <QCard>
    <QCardSection class="q-px-sm q-py-xs">
      <div class="text-h6 flex items-center">
        <span class="q-mr-sm">
          {{ data.name }}
        </span>
        <QChip size="sm" :color="data.scheduleClasses >= data.numberOfClasses ? 'black' : 'red'" text-color="white" class="q-ml-sm text-weight-medium">
          {{ data.scheduleClasses }}/{{ data.numberOfClasses }}
        </QChip>
      </div>
    </QCardSection>
    <QCardSection horizontal class="justify-between items-center q-px-sm">
      <QCardSection horizontal class="items-center q-gutter-md">
        <div class="text-body1 text-weight-medium">
          {{ getDurationLabel(data.startTime, data.endTime) }}
        </div>
      </QCardSection>
      <QCardActions class="q-pa-none">
        <QBtn icon="o_delete" flat round @click="$emit('delete', data.id)" />
      </QCardActions>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
  :deep(.q-chip__content) {
  font-weight: 500;
  font-size: 11px;
}
</style>
