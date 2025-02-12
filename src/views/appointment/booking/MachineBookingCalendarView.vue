<script setup lang='ts'>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useAppointmentStore, useOptionStore } from '@/stores';
import { MachineTypes } from '@/const/general';
import MachineCalendar from '@/components/appointment/MachineCalendar.vue';
import { today } from '@quasar/quasar-ui-qcalendar';
import { useRouter } from 'vue-router';
import { AppointmentAdder, AppointmentBox, AppointmentBoxRearranged } from '@/components/appointment';
import { getTimeDate } from '@/utils/date';
import { useQuasar } from 'quasar';
import type { Available, AvailableReq } from '@/api';

const props = defineProps<{
  machineType: `${MachineTypes}`;
}>();

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const optionStore = useOptionStore();
const router = useRouter();

const machineList = computed(() => optionStore.machineList.filter(m => m.type === +props.machineType));
const selectedDate = ref(appointmentStore.availableQuery?.date ?? today());

onBeforeUnmount(() => {
  appointmentStore.rearrangeMode = false;
});

watch(selectedDate, async (newDate) => {
  try {
    $q.loading.show();
    // if (appointmentStore.rearrangeMode && appointmentStore.rearrangeQuery) {
    //   appointmentStore.rearrangeQuery.date = newDate;
    //   await appointmentStore.getAvailableRearranged(appointmentStore.rearrangeQuery);
    // }
    // else {
    const { userShiftType, startTime, endTime } = appointmentStore.availableQuery as AvailableReq;
    appointmentStore.availableQuery = { userShiftType, startTime, endTime, date: newDate };
    await appointmentStore.getAvailable(appointmentStore.availableQuery);
    // }
    appointmentStore.querySent = true;
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
});

function requery() {
  appointmentStore.resetAppointmentQueryState();
  appointmentStore.querySent = false;
  router.push({ name: 'appointmentBookingQuery' });
}

function getIntervals(scope: any) {
  const machineId = scope.resource.id;
  const times = getTimesArray(appointmentStore.queryCalendarStyle.start! / 2, appointmentStore.queryCalendarStyle.count!, 30);

  const available = appointmentStore.available.filter(item => item.machine!.id === machineId);
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

function getStyle(interval: any) {
  return {
    'position': 'absolute',
    'left': `${interval.left}px`,
    'width': `${interval.width - 1}px`,
    'z-index': `${interval.index}`,
    'background': 'white',
  };
}

const stateOfAppointmentDialog = ref(false);
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
</script>

<template>
  <div style="overflow:unset" class="machine_booking_calendar">
    <MachineCalendar
      v-model="selectedDate"
      :model-resources="machineList"
      :resource-width="200"
      :interval-start="appointmentStore.queryCalendarStyle.start"
      :interval-count="appointmentStore.queryCalendarStyle.count"
      :interval-minutes="30"
    >
      <template #nav="{ calendar }">
        <div class="machine_booking_calendar_header">
          <h3>{{ MachineTypes[machineType] }}</h3>
          <div class="column items-center q-gutter-md">
            <DatePicker v-model="selectedDate" />
            <CalendarNav
              @prev="calendar?.prev"
              @today="calendar?.moveToToday"
              @next="calendar?.next"
            />
          </div>
          <QBtn label="重新查詢" outline dense padding="10px 24px" @click="requery" />
        </div>
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
    </MachineCalendar>
  </div>
  <QDialog v-model="stateOfAppointmentDialog" persistent>
    <AppointmentBox @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
  </QDialog>
</template>

<style lang="scss" scoped>
:deep(.machine_booking_calendar_header) {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 10px;
}

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
