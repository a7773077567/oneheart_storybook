<script setup lang="ts">
import { ref } from 'vue';
import { ShiftChip, ShiftSelector } from '@/components/shift';
import { type Employee, type EmployeeShiftRes, type ShiftRes, createEmployeeShifts, deleteEmployeeShift, fetchEmployeeShifts, fetchEmployees, fetchShifts } from '@/api/shift';
import dayjs from 'dayjs';

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const addingShift = ref(false);
const targetDate = ref<string | null >(null);
const employees = ref<Employee[]>([]);
const targetEmployeeId = ref<number | null>(null);
const employeeShifts = ref<EmployeeShiftRes[]>();
const shifts = ref<ShiftRes[]>([]);

getEmployeeShifts();
getShifts();
await getEmployees();

function getDayShifts(date: string, employeeId: string) {
  const currentDay = dayjs(date);

  const items = employeeShifts.value?.filter(item =>
    dayjs(item.date).isSame(currentDay, 'date') && +employeeId === item.employeeId,
  );
  return items;
}
async function getEmployees() {
  employees.value = await fetchEmployees();
}
async function getEmployeeShifts() {
  employeeShifts.value = await fetchEmployeeShifts();
}
async function getShifts() {
  shifts.value = await fetchShifts();
}

function openShiftSelector(date: string, employeeId: number) {
  targetDate.value = date;
  targetEmployeeId.value = employeeId;
  addingShift.value = true;
}

async function addEmployeeShift(shiftIds: number[]) {
  await createEmployeeShifts(targetEmployeeId.value!, {
    date: targetDate.value!,
    shiftIds,
  });
  targetEmployeeId.value = null;
  targetDate.value = null;
  addingShift.value = false;
  getEmployeeShifts();
}

async function removeEmployeeShift(employeeShiftId: number) {
  await deleteEmployeeShift(employeeShiftId);
  getEmployeeShifts();
}
</script>

<template>
  <div class="shift-list">
    <Calendar
      v-model="selectedDate"
      v-model:model-resources="employees"
      view="week"
    >
      <template #day="{ scope: { resource, timestamp, isEditing } }">
        <div class="day">
          <ShiftChip
            v-for="(item, idx) in getDayShifts(timestamp.date, resource.id)"
            :key="idx"
            :data="item"
            :edit-mode="isEditing"
            @delete="removeEmployeeShift"
          />
          <QBtn v-if="isEditing" icon="add" flat round size="10px" @click="() => openShiftSelector(timestamp.date, resource.id)" />
        </div>
      </template>
    </Calendar>
    <QDialog v-model="addingShift" persistent>
      <ShiftSelector :data="shifts" @confirm="addEmployeeShift" />
    </QDialog>
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
</style>
