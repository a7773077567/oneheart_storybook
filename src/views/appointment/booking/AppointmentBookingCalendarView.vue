<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { AppointmentAdder, AppointmentBox, AppointmentBoxRearranged } from '@/components/appointment';
import { useAppointmentStore, useUserStore } from '@/stores';
import { useQuasar } from 'quasar';
import type { Available, AvailableReq } from '@/api/appointment';
import { getTimeDate } from '@/utils/date';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { AddOnServiceTypes, ShiftType } from '@/const/general';

interface CalendarInterval {
  available?: Available;
  left: number;
  width: number;
  canBook: boolean;
  index: number;
}

const $q = useQuasar();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);
const selectedDate = ref(getDate());
const stateOfAppointmentDialog = ref(false);

const queryAddOns = computed(() => appointmentStore.queryAddOns.map(addOn => AddOnServiceTypes[addOn]));
const queryAppointmentType = computed(() => appointmentStore.availableQuery?.userShiftType && ShiftType[appointmentStore.availableQuery?.userShiftType]);
const ifAutoRecommend = computed(() => appointmentStore.availableQuery?.autoRecommend);

const therapistOptions = computed(() => ifAutoRecommend.value ? appointmentStore.autoRecommendTherpists : appointmentStore.currentNonFronDeskUsers);

onBeforeUnmount(() => {
  appointmentStore.rearrangeMode = false;
});

watch(selectedDate, async (newDate) => {
  try {
    $q.loading.show();
    if (appointmentStore.rearrangeMode && appointmentStore.rearrangeQuery) {
      appointmentStore.rearrangeQuery.date = newDate;
      await appointmentStore.getAvailableRearranged(appointmentStore.rearrangeQuery);
    }
    else {
      appointmentStore.availableQuery = { ...appointmentStore.availableQuery ?? {} as AvailableReq, date: newDate };
      const apiQuery = { ...appointmentStore.availableQuery };
      if (apiQuery.autoRecommend) {
        delete apiQuery.userIds;
      }
      await appointmentStore.getAvailable(appointmentStore.availableQuery);

      if (apiQuery.autoRecommend) {
        appointmentStore.appointmentCalendarInitOption = appointmentStore.autoRecommendTherpistIds; // refactor, 拿掉 initOptions 用法
      }
    }
    appointmentStore.querySent = true;
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
});

onBeforeRouteLeave(() => {
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
  appointmentStore.targetAvailable = { ...available, autoRecommand: !!ifAutoRecommend.value };
  stateOfAppointmentDialog.value = true;
}

// disable for now
// function afterAppointment(appointment?: Available) {
//   stateOfAppointmentDialog.value = false;
//   const query = { date: appointment?.date };
//   router.push({ name: 'appointmentListCalendar', ...(appointment?.date ? { query } : {}) });
// }
function afterAppointment() {
  stateOfAppointmentDialog.value = false;
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
  router.push({ name: 'appointmentBookingQuery' });
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
      v-model:model-resources="therapistOptions"
      :interval-start="appointmentStore.queryCalendarStyle.start"
      :interval-count="appointmentStore.queryCalendarStyle.count"
      :init-options="appointmentStore.appointmentCalendarInitOption"
      :interval-minutes="30"
      :disable-filter="ifAutoRecommend"
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
      <template #middle>
        <h3 class="sm_title">
          <template v-if="!!queryAddOns && queryAddOns.length > 0">{{ queryAppointmentType }}｜加購儀器 {{ queryAddOns.join('、') }} </template>
          <template v-else-if="ifAutoRecommend">{{ queryAppointmentType }} (自動推薦治療師)</template>
        </h3>
      </template>
    </ResourceCalendar>
    <QDialog v-model="stateOfAppointmentDialog" persistent>
      <AppointmentBoxRearranged v-if="appointmentStore.rearrangeMode" @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
      <AppointmentBox v-else @close="stateOfAppointmentDialog = false" @appointment="afterAppointment" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.sm_title {
  @include text-style($title-small, $on-surface-variant);
  margin: 16px 0;
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
