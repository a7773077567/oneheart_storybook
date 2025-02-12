<script setup lang='ts'>
import { computed } from 'vue';
import type { MachineSchedule } from '@/api';
import { MachineTypes } from '@/const/general';

interface Props {
  data: MachineSchedule;
}
const props = defineProps<Props>();
const schedulePeriod = computed(() => `${props.data.scheduleStartTime} - ${props.data.scheduleEndTime}`);
</script>

<template>
  <QCard flat class="machine-card">
    <QCardSection class="q-pa-none machine-card__time">{{ schedulePeriod }}</QCardSection>
    <QCardSection class="q-pa-none machine-card__client">{{ data.client.name }}</QCardSection>
    <QCardSection class="q-pa-none machine-card__detail">
      {{ MachineTypes[data.machines[0].type] }}
    </QCardSection>
    <QTooltip class="bg-black text-white booking-card__note q-pa-md" anchor="center right" self="bottom middle" max-width="264px" max-height="160px">
      <p class="q-mb-xs text-bold">{{ `${data.scheduleStartTime}-${data.scheduleEndTime}` }}</p>
      <div>
        <p class="q-mb-xs">客戶：{{ data.client.name }}</p>
      </div>
      <p class="q-mb-xs">科別：{{ MachineTypes[data.machines[0].type] }}</p>
      <p v-if="!!data.note" class="note">預約備註：{{ data.note || '-' }}</p>
    </QTooltip>
  </QCard>
</template>

<style scoped lang="scss">
.machine-card {
  background-color: #e1e5ec;
  position: relative;
  padding: 8px;
  color: #1a1b21;
  &__time {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  &__client {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  &__detail {
    font-size: 12px;
    font-weight: 500;
  }
}
</style>

<style lang="scss">
.q-tooltip {
  font-size: 14px !important;
  overflow: hidden;
  .note {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .tooltip_info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
