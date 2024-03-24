<script setup lang="ts">
import { ref } from 'vue';
import { ShiftChip, ShiftSelector } from '@/components/shift';
import { type Employee, type EmployeeShiftRes, type ShiftTemplate, createUserShift, deleteEmployeeShift, fetchEmployeeShifts, fetchEmployees, toUserShiftReq } from '@/api/shift';
import dayjs from 'dayjs';
import { useShiftStore } from '@/stores';
import { storeToRefs } from 'pinia';

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const addingShift = ref(false);
const targetDate = ref<string | null >(null);
const employees = ref<Employee[]>([]);
const targetUserId = ref<number | null>(null);
const employeeShifts = ref<EmployeeShiftRes[]>();
// const shifts = ref<ShiftRes[]>([]);

const shiftStore = useShiftStore();
const { shiftTemplates } = storeToRefs(shiftStore);
const { getShiftTemplates } = shiftStore;

getEmployeeShifts();
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

async function openShiftSelector(date: string, employeeId: number) {
  await getShiftTemplates();
  targetDate.value = date;
  targetUserId.value = employeeId;
  addingShift.value = true;
}

async function addUserShift(shiftTemplate: ShiftTemplate) {
  const payload = toUserShiftReq(shiftTemplate, targetUserId.value!, targetDate.value!);
  await createUserShift(payload);
  targetUserId.value = null;
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
      <ShiftSelector :data="shiftTemplates" @confirm="addUserShift" />
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
