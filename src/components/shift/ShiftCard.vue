<script setup lang="ts">
import type { ShiftRes } from '@/api/shift';
import { getDurationLabel } from '@/utils/date';

interface Props {
  shift: ShiftRes;
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
      <div class="text-h6">
        {{ shift.name }}
      </div>
    </QCardSection>
    <QCardSection horizontal class="justify-between items-center q-px-sm">
      <QCardSection horizontal class="items-center q-gutter-md">
        <div class="text-body1 text-weight-medium">
          {{ getDurationLabel(shift.duration) }}
        </div>
        <QBadge v-for="(item, index) in shift.unavailable" :key="index" color="grey-4" text-color="black" class="text-body2 ">
          {{ `不可預約時間${getDurationLabel(item, true)}` }}
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
