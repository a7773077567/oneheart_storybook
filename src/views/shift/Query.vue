<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Employee, type EmployeeShiftRes, fetchEmployeeShifts, fetchEmployees } from '@/api/shift';
import dayjs from 'dayjs';
import { DurationPicker, ShiftChip } from '@/components/shift';

const startDate = ref<string>(dayjs().startOf('M').format('YYYY/MM/DD'));
const endDate = ref<string>(dayjs().endOf('M').format('YYYY/MM/DD'));
const duration = computed(() => `${startDate.value}-${endDate.value}`);
const currentDate = computed(() => dayjs(startDate.value).format('YYYY-MM-DD'));
const days = computed(() => dayjs(endDate.value).diff(startDate.value, 'day') + 1);
const employees = ref<Employee[]>([]);
const employeeShifts = ref<EmployeeShiftRes[]>();

getEmployeeShifts();
await getEmployees();

async function getEmployees() {
  employees.value = await fetchEmployees();
}

function getDayShifts(date: string, employeeId: string) {
  const currentDay = dayjs(date);

  const items = employeeShifts.value?.filter(item =>
    dayjs(item.date).isSame(currentDay, 'date') && +employeeId === item.employeeId,
  );
  return items;
}
async function getEmployeeShifts() {
  employeeShifts.value = await fetchEmployeeShifts();
}
</script>

<template>
  <div class="shift-query">
    <div class="text-h6 q-mb-md">
      查詢班表
    </div>
    <div class="row justify-between items-center q-mb-lg">
      <DurationPicker
        v-model:start-date="startDate"
        v-model:end-date="endDate"
      />
      <QBtn label="查詢班表" outline />
    </div>
    <Calendar
      v-model="currentDate"
      v-model:modelResources="employees"
      simple-mode
      view="day"
      :max-days="days"
      cell-width="114px"
    >
      <template #nav-right>
        <span class="text-h6">{{ duration }}</span>
      </template>
      <template #day="{ scope: { resource, timestamp } }">
        <div class="day">
          <ShiftChip
            v-for="(item, idx) in getDayShifts(timestamp.date, resource.id)"
            :key="idx"
            :data="item"
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
</style>
