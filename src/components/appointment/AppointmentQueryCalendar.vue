<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { AppointmentAdder, AppointmentBox, AppointmentBoxRearranged } from '@/components/appointment';
import { useAppointmentStore, useUserStore } from '@/stores';
import { useQuasar } from 'quasar';
import type { Available } from '@/api/appointment';
import { getTimeDate } from '@/utils/date';

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);
const selectedDate = ref(getDate());
const stateOfAppointmentDialog = ref(false);

onBeforeUnmount(() => {
  appointmentStore.resetAppointmentQueryState();
  appointmentStore.resetClientSchedulesNotStartedState();
  appointmentStore.resetTargetAppointmentState();
});

interface CalendarInterval {
  available?: Available;
  left: number;
  width: number;
  canBook: boolean;
  index: number;
}
function getStyle(interval: CalendarInterval) {
  return {
    'position': 'absolute',
    'left': `${interval.left}px`,
    'width': `${interval.width - 1}px`,
    'z-index': `${interval.index}`,
    'background': 'white',
  };
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
        index: 0,
      };
    }
    const { startTime, endTime } = targetAvailable;
    const start = getTimeDate(startTime);
    const end = getTimeDate(endTime);
    const duration = end.diff(start, 'm');
    const isSlotType = targetAvailable.type === 2;
    const durationWidth = isSlotType ? 60 : duration;
    return {
      available: targetAvailable,
      left: scope.timeStartPosX(startTime),
      width: scope.timeDurationWidth(durationWidth),
      canBook: true,
      index: 10,
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

function getDate() {
  const target = appointmentStore.availableQuery || appointmentStore.rearrangeQuery;
  return target!.date;
}
</script>

<template>
  <div class="booking-calendar">
    <ResourceCalendar
      v-model="selectedDate"
      v-model:model-resources="appointmentStore.activeUsers"
      :interval-start="appointmentStore.queryCalendarStyle.start"
      :interval-count="appointmentStore.queryCalendarStyle.count"
      @model-resources="appointmentStore.users = $event"
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
      <AppointmentBoxRearranged v-if="appointmentStore.rearrangeMode" @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
      <AppointmentBox v-else @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
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
// Display the user block above the interval-item
:deep(.q-calendar-resource__resource.q-calendar__sticky) {
  z-index: 100;
}
</style>
