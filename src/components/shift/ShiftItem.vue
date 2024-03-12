<script setup lang="ts">
import type { ShiftRes } from '@/api/shift';
import { getDurationLabel } from '@/utils/date';

interface Props {
  data: ShiftRes;
}

defineProps<Props>();
</script>

<template>
  <div
    class="shift-item"
  >
    <span class="shift-item__name">{{ data.name }}</span>
    <span>{{ getDurationLabel(data.duration) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.shift-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 10px 15px;
  border: 1px solid #515050;
  cursor: pointer;
  transition: 200ms ease;

  &__name {
    font-size: 16px;
  }
}
</style>
