<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { DurationPicker, ShiftChip } from '@/components/shift';
import { useShiftStore, useUserStore } from '@/stores';

const shiftStore = useShiftStore();
const userStore = useUserStore();

const duration = ref({
  startDate: dayjs().startOf('M').format('YYYY/MM/DD'),
  endDate: dayjs().endOf('M').format('YYYY/MM/DD'),
});
const currentDate = computed(() => dayjs(duration.value.startDate).format('YYYY-MM-DD'));
const days = computed(() => dayjs(duration.value.endDate).diff(duration.value.startDate, 'day') + 1);
const userIds = computed(() => shiftStore.users.map(user => user.id));

await shiftStore.getUsers([userStore.currentSpaceId!]);
watch(duration, getUserShifts, { immediate: true });

function getDayShifts(date: string, employeeId: string) {
  const currentDay = dayjs(date);

  const items = shiftStore.userShifts.filter(item =>
    dayjs(item.date).isSame(currentDay, 'date') && +employeeId === item.userId,
  );
  return items;
}

function getUserShifts() {
  shiftStore.getUserShifts({
    startDate: duration.value.startDate.replace(/\//g, '-'),
    endDate: duration.value.endDate.replace(/\//g, '-'),
    userIds: userIds.value,
  });
}
</script>

<template>
  <div class="shift-query">
    <div class="text-h6 q-mb-md">
      查詢班表
    </div>
    <div class="row justify-between items-center q-mb-lg">
      <DurationPicker
        v-model="duration"
      />
      <!-- <QBtn label="查詢班表" outline /> -->
    </div>
    <Calendar
      v-model="currentDate"
      :model-resources="shiftStore.activeUsers"
      simple-mode
      view="day"
      :max-days="days"
      cell-width="114px"
      @model-resources="shiftStore.users = $event"
    >
      <template #nav-right>
        <span class="text-h6">{{ `${duration.startDate}-${duration.endDate}` }}</span>
      </template>
      <template #day="{ scope: { resource, timestamp } }">
        <div class="day">
          <ShiftChip
            v-for="(item, idx) in getDayShifts(timestamp.date, resource.id)"
            :key="idx"
            :data="item"
            :is-group-class="item.type === 11"
          />
        </div>
      </template>
    </Calendar>
  </div>
</template>

<style lang="scss" scoped>
.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 12px;
  overflow-y: scroll;
  > * {
    flex-shrink: 0;
  }
}

:deep(.q-field__native > span) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(.calendar__body) {
  height: calc(100vh - 329px);
}
</style>
