<script setup lang="ts">
import { QCalendarScheduler, today } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass';
import { computed, ref } from 'vue';
import { CalendarNav, ShiftChip, ShiftSelector } from '@/components/shift';
import { getWeekDay } from '@/utils/date';
import { type Employee, type EmployeeShiftRes, type ShiftRes, createEmployeeShifts, deleteEmployeeShift, fetchEmployeeShifts, fetchEmployees, fetchShifts } from '@/api/shift';
import dayjs from 'dayjs';

const calendar = ref<QCalendarScheduler | null>(null);

const selectedDate = ref(today());
const currentDate = computed(() => dayjs(selectedDate.value).format('YYYY年M月D日'));
const isEditing = ref(false);
const addingShift = ref(false);
const targetDate = ref<string | null >(null);

const employees = ref<Employee[]>([]);
const targetEmployeeId = ref<number | null>(null);
await getEmployees();
const employeeOptions = computed(() => employees.value.map(({ id, name }) => ({
  label: name,
  value: id,
})));
const targetEmployees = ref(employeeOptions.value.map(option => option.value));
const showingEmployees = computed(() => {
  return employees.value.filter(employee => targetEmployees.value.includes(employee.id));
});

const employeeShifts = ref<EmployeeShiftRes[]>();
await getEmployeeShifts();

const shifts = ref<ShiftRes[]>([]);
await getShifts();

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
    <div class="shift-list__nav">
      <OSelect
        v-model="targetEmployees"
        name="employee"
        :options="employeeOptions"
        multiple
        emit-value
        map-options
        dense
        outlined
        hide-bottom-space
        style="width: 164px;"
      />
      <div class="column items-center q-gutter-md">
        <div class="date-picker">
          <span class="date-picker__label">{{ currentDate }}</span>
          <QIcon name="o_calendar_month" size="28px" class="cursor-pointer">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QDate v-model="selectedDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Close" color="primary" flat />
                </div>
              </QDate>
            </QPopupProxy>
          </QIcon>
        </div>
        <CalendarNav
          @prev="calendar?.prev"
          @today="calendar?.moveToToday"
          @next="calendar?.next"
        />
      </div>
      <QBtn
        :label="isEditing ? '取消編輯' : '編輯'"
        outline
        style="width: 113px;"
        @click="isEditing = !isEditing"
      />
    </div>
    <QCalendarScheduler
      ref="calendar"
      v-model="selectedDate"
      v-model:model-resources="showingEmployees"
      view="week"
      resource-key="id"
      resource-label="name"
      :resource-height="105"
      animated
      bordered
    >
      <template #head-resources>
        <div class="row flex-center full-width">
          <span class="text-weight-bold">人員</span>
        </div>
      </template>
      <template #head-day="{ scope: { timestamp } }">
        <div class="row flex-center ">
          <span class="text-weight-bold">{{ timestamp.day }}</span>
          <span class="text-weight-bold">{{ getWeekDay(timestamp.weekday) }}</span>
        </div>
      </template>
      <template #resource-label="{ scope: { resource } }">
        <div class="col-12">
          <QChip>
            <QAvatar>
              <img
                v-if="resource.avatar"
                :src="resource.avatar"
              >
              <QIcon
                v-if="resource.icon"
                :name="resource.icon"
              />
            </QAvatar>
            {{ resource.name }}
          </QChip>
        </div>
      </template>
      <template #day="{ scope: { resource, timestamp } }">
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
    </QCalendarScheduler>
    <QDialog v-model="addingShift" persistent>
      <ShiftSelector :data="shifts" @confirm="addEmployeeShift" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.date-picker {
  width: 356px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #f5f5f5;
  border-radius: 20px;
  &__label {
    font-size: 19px;
  }
}
.shift-list {
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
}
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
