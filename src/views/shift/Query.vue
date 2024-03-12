<script setup lang="ts">
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass';
import { computed, ref } from 'vue';
import { type Employee, type EmployeeShiftRes, fetchEmployeeShifts, fetchEmployees } from '@/api/shift';
import { getWeekDay } from '@/utils/date';
import dayjs from 'dayjs';
import { ShiftChip } from '@/components/shift';

const calendar = ref<QCalendarScheduler | null>(null);
const startDate = ref<string>(dayjs().startOf('M').format('YYYY/MM/DD'));
const endDate = ref<string>(dayjs().endOf('M').format('YYYY/MM/DD'));
const duration = computed(() => `${startDate.value}-${endDate.value}`);
const currentDate = computed(() => dayjs(startDate.value).format('YYYY-MM-DD'));
const days = computed(() => dayjs(endDate.value).diff(startDate.value, 'day') + 1);
const employeeShifts = ref<EmployeeShiftRes[]>();
await getEmployeeShifts();

const employees = ref<Employee[]>([]);
await getEmployees();
const employeeOptions = computed(() => employees.value.map(({ id, name }) => ({
  label: name,
  value: id,
})));
const targetEmployees = ref(employeeOptions.value.map(option => option.value));
const showingEmployees = computed(() => {
  return employees.value.filter(employee => targetEmployees.value.includes(employee.id));
});

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
      <div class="row items-center q-gutter-sm">
        <span>日期</span>
        <QInput v-model="startDate" dense outlined hide-bottom-space no-error-icon mask="date" :rules="['date']">
          <template #append>
            <QIcon name="event" class="cursor-pointer">
              <QPopupProxy cover transition-show="scale" transition-hide="scale">
                <QDate v-model="startDate">
                  <div class="row items-center justify-end">
                    <QBtn v-close-popup label="Close" color="primary" flat />
                  </div>
                </QDate>
              </QPopupProxy>
            </QIcon>
          </template>
        </QInput>
        <span>至</span>
        <QInput v-model="endDate" dense outlined hide-bottom-space no-error-icon mask="date" :rules="['date']">
          <template #append>
            <QIcon name="event" class="cursor-pointer">
              <QPopupProxy cover transition-show="scale" transition-hide="scale">
                <QDate v-model="endDate">
                  <div class="row items-center justify-end">
                    <QBtn v-close-popup label="Close" color="primary" flat />
                  </div>
                </QDate>
              </QPopupProxy>
            </QIcon>
          </template>
        </QInput>
        <span>止</span>
      </div>
      <QBtn label="查詢班表" outline />
    </div>
    <div class="row justify-between items-center q-mb-md">
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
      <span class="text-h6">{{ duration }}</span>
    </div>
    <QCalendarScheduler
      ref="calendar"
      v-model:model-resources="showingEmployees"
      :model-value="currentDate"
      view="day"
      cell-width="114px"
      resource-key="id"
      resource-label="name"
      :resource-height="105"
      animated
      bordered
      :max-days="days"
    >
      <template #head-resources>
        <div class="row flex-center full-width">
          <span class="text-weight-bold">人員</span>
        </div>
      </template>
      <template #head-day="{ scope: { timestamp } }">
        <div class="row flex-center ">
          <span class="text-weight-bold">{{ `${timestamp.month}/${timestamp.day}` }}</span>
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
          />
        </div>
      </template>
    </QCalendarScheduler>
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
