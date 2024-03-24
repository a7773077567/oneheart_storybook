<script setup lang="ts">
import type { BookingItem } from '@/api/appointment';
import { TherapyTypes } from '@/const/general';

interface Props {
  data: BookingItem;
}

const props = defineProps<Props>();
const data = new Map([
  ['日期', () => props.data.date],
  ['時間', () => props.data.time],
  ['客戶', () => props.data.client.name],
  ['科別', () => Object.values(TherapyTypes)[props.data.type]],
  ['治療師', () => props.data.therapist.name],
]);
</script>

<template>
  <div class="table">
    <div class="table__body">
      <div
        v-for="([key, getter], idx) in data.entries()"
        :key="idx"
        class="table__column"
      >
        <div class="table__cell">
          {{ key }}
        </div>
        <div class="table__cell">
          {{ getter() }}
        </div>
      </div>
    </div>
    <div class="table__actions">
      <QBtn label="取消預約" outline rounded dense color="grey-9" padding="6px 9px" style="border-radius: 8px;" />
      <QBtn label="預約改期" outline rounded dense color="grey-9" padding="6px 9px" style="border-radius: 8px;" />
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
  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 10px 0;
    border: 1px solid #79747e;
  }
}
</style>
