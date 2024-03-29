<script setup lang="ts">
import { ref } from 'vue';
import { AppointmentAdder, AppointmentBox } from '@/components/appointment';
import { useAppointmentStore } from '@/stores';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import type { Available } from '@/api/appointment';

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const stateOfAppointmentDialog = ref(false);

function getStyle(interval: CalendarInterval) {
  return {
    position: 'absolute',
    left: `${interval.left}px`,
    width: `${interval.width - 1}px`,
  };
}

interface CalendarInterval {
  available?: Available;
  left: number;
  width: number;
  canBook: boolean;
}

function getIntervals(scope: any): CalendarInterval[] {
  const userId = scope.resource.id;
  const times = getTimesArray(appointmentStore.queryCalendarStyle.start!, appointmentStore.queryCalendarStyle.count!);
  const available = appointmentStore.available.filter(item => item.user.id === userId);
  const interval = times.map((time) => {
    const targetAvailable = available.find(item => item.startTime === time);
    if (!targetAvailable) {
      return {
        left: scope.timeStartPosX(time),
        width: scope.timeDurationWidth(60),
        canBook: false,
      };
    }
    return {
      available: targetAvailable,
      left: scope.timeStartPosX(targetAvailable.startTime),
      width: scope.timeDurationWidth(60),
      canBook: true,
    };
  },
  );
  return interval;
}

function OpenAppointmentDialog(available: Available) {
  appointmentStore.targetAvailable = available;
  stateOfAppointmentDialog.value = true;
}

function afterAppointment() {
  stateOfAppointmentDialog.value = false;
  $q.dialog({
    message: '預約成功',
  });
}

function getTimesArray(start: number, count: number) {
  const array = [...Array(count).keys()];
  return array.map((item) => {
    const offset = start + item;
    return `${offset < 10 ? '0' : ''}${offset}:00`;
  });
}

function requery() {
  appointmentStore.resetAppointmentQueryState();
  appointmentStore.querySent = false;
}
</script>

<template>
  <div class="booking-calendar">
    <ResourceCalendar
      v-model="selectedDate"
      v-model:model-resources="appointmentStore.users"
      :interval-start="appointmentStore.queryCalendarStyle.start"
      :interval-count="appointmentStore.queryCalendarStyle.count"
    >
      <template #nav-right>
        <QBtn label="重新查詢" outline dense padding="10px 24px" @click="requery" />
      </template>
      <template #intervals="{ scope }">
        <AppointmentAdder
          v-for="(interval, idx) in getIntervals(scope)"
          :key="idx"
          :disable="!interval.canBook"
          :style="getStyle(interval)"
          @add="() => OpenAppointmentDialog(interval.available!)"
        />
      </template>
    </ResourceCalendar>
    <QDialog v-model="stateOfAppointmentDialog" persistent>
      <AppointmentBox @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.q-calendar-resource__head--interval) {
  font-size: 14px;
  font-weight: 500;
}
:deep(.q-calendar-resource__resource--interval) {
  min-height: 116px !important;
}
</style>
