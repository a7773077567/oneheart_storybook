<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { AppointmentAdder, AppointmentBox, AppointmentBoxRearranged } from '@/components/appointment';
import { useAppointmentStore, useUserStore } from '@/stores';
import { useQuasar } from 'quasar';
import type { Available, AvailableReq } from '@/api/appointment';
import { getTimeDate } from '@/utils/date';

interface CalendarInterval {
  available?: Available;
  left: number;
  width: number;
  canBook: boolean;
  index: number;
}

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);
const selectedDate = ref(getDate());
const stateOfAppointmentDialog = ref(false);

// handle calendar date change
watch(selectedDate, async (newDate) => {
  appointmentStore.availableQuery = { ...appointmentStore.availableQuery ?? {} as AvailableReq, date: newDate };
  await appointmentStore.getAvailable(appointmentStore.availableQuery);
  appointmentStore.querySent = true;
});

onBeforeUnmount(() => {
  appointmentStore.resetAppointmentQueryState();
  appointmentStore.resetClientSchedulesNotStartedState();
  appointmentStore.resetTargetAppointmentState();
});

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
  const times = getTimesArray(appointmentStore.queryCalendarStyle.start! / 2, appointmentStore.queryCalendarStyle.count!, 30);

  const available = appointmentStore.available.filter(item => item.user.id === userId);
  const interval = times.map((time) => {
    const targetAvailable = available.find(item => item.startTime === time);
    if (!targetAvailable) {
      return {
        left: scope.timeStartPosX(time),
        width: scope.timeDurationWidth(30),
        canBook: false,
        index: 0,
      };
    }
    const { startTime, endTime } = targetAvailable;
    const start = getTimeDate(startTime);
    const end = getTimeDate(endTime);
    const duration = end.diff(start, 'm');
    // const isSlotType = targetAvailable.type !== 11;
    // const durationWidth = isSlotType ? duration : ;
    return {
      available: targetAvailable,
      left: scope.timeStartPosX(startTime),
      width: scope.timeDurationWidth(duration),
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

function getTimesArray(start: number, count: number, interval: number) {
  const step = interval / 60;
  const array = [...Array(count).keys()];

  return array.map((item) => {
    const offset = (start + item * step).toFixed(1);
    const [hrUnit, minUnit] = offset.toString().split('.');
    const hrStr = hrUnit.padStart(2, '0');
    const minStr = `${+minUnit / 10 * 60}`.padEnd(2, '0');

    return `${hrStr}:${minStr}`;
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
      v-model:model-resources="appointmentStore.currentNonFronDeskUsers"
      :interval-start="appointmentStore.queryCalendarStyle.start"
      :interval-count="appointmentStore.queryCalendarStyle.count"
      :init-options="appointmentStore.appointmentCalendarInitOption"
      :interval-minutes="30"
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
  min-height: 135px !important;
}
// Display the user block above the interval-item
:deep(.q-calendar-resource__resource.q-calendar__sticky) {
  z-index: 100;
}
</style>
