<script setup lang="ts">
import type { UserShift } from '@/api';

defineProps<{
  name: string;
  shifts: UserShift[];
}>();
</script>

<template>
  <div class="resource-label">
    <div class="resource-label__name">{{ name }}</div>
    <div class="resource-label__shifts">
      <div v-for="(shift, idx) in shifts?.slice(0, 3)" :key="idx" class="resource-label__shift" :style="{ background: shift.color }">
        {{ shift.name }}
      </div>
      <p v-if="shifts.length > 3" class="resource-label__ellipsis">+{{ shifts.length - 3 }}...</p>
      <QTooltip v-if="shifts.length" anchor="top right" self="center left" :offset="[-20, 0]" style="background: #111;">
        <div class="tooltip">
          <p v-for="(shift, idx) in shifts" :key="idx">
            {{ `${shift.startTime}-${shift.endTime} ${shift.name}` }}
          </p>
        </div>
      </QTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resource-label {
  padding: 4px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &__name {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
  &__shifts {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-grow: 1;
  }
  &__shift {
    padding: 2px 4px;
    border-radius: 2px;
    color: #1a1b21;
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
  }
  &__ellipsis {
    color: #45464f;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
  }
}

.tooltip {
  > p {
    font-size: 14px;
    color: #f1f0f7;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }
}
</style>
