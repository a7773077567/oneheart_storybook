<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useAppointmentStore, useOptionStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { AppointmentCard, AppointmentCountCard, ResourceLabel } from '@/components/appointment';
import { useRoute, useRouter } from 'vue-router';
import type { ClientSchedule, MachineSchedule } from '@/api';
import { useQuasar } from 'quasar';
import { getDuration } from '@/utils/date';
import MachineCalendar from '@/components/appointment/MachineCalendar.vue';
import MachineCard from '@/components/appointment/MachineCard.vue';
import { ShiftType } from '@/const/general';
import { PaymentState } from '@/const/appointment';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
const optionStore = useOptionStore();

await appointmentStore.getUsers([userStore.currentSpaceId!]);

const isBookingsBoxOpen = ref(false);
const bookingsInBox = ref<any[]>();
const selectedDate = ref(route.query.date as string ?? dayjs().format('YYYY-MM-DD'));
const selectedMachines = ref<number[]>(optionStore.machineList.map(m => m.id));
const machineOptions = computed(() => optionStore.machineList.map(machine => ({ value: machine.id, label: machine.name })));

// to refactor, filter machine or filter person no need to fetch both
watchEffect(async () => {
  try {
    $q.loading.show();
    await Promise.all([
      appointmentStore.getClientSchedulesInProgress(selectedDate.value),
      appointmentStore.getMachineScheduleInprogress({ date: selectedDate.value, machineIds: selectedMachines.value }),
      appointmentStore.getShifts({ startDate: selectedDate.value, endDate: selectedDate.value, userIds: appointmentStore.activeUsers.map(item => item.id) }),
    ]);
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
});

function getStyle(item: any) {
  return {
    position: 'absolute',
    left: `${item.left}px`,
    width: `${item.width - 1}px`,
    top: `${item.top}px`,
    bottom: `${item.bottom ?? 10}px`,
  };
}

function getBookings(scope: any) {
  const employeeId = scope.resource.id;
  const bookings = appointmentStore.clientSchedulesInProgress.filter(item => item.userShift.user.id === employeeId);
  const bookingGroup = bookings.reduce((acc, item) => {
    const startTime = item.scheduleStartTime;
    const group = acc[startTime] ?? [];
    group.push(item);
    return { ...acc, [startTime]: group };
  }, {} as Record<string, ClientSchedule[]>);

  return Object.values(bookingGroup).map((item) => {
    const { scheduleStartTime, scheduleEndTime } = item[0];
    const isAllCheckout = item.every(el => el.paymentState === PaymentState['已結帳']);
    const duration = getDuration(scheduleStartTime, scheduleEndTime, 'm');
    const durationWidth = scope.timeDurationWidth(duration) - 20;
    const cardMinWidth = 105;

    return {
      bookings: item,
      left: scope.timeStartPosX(scheduleStartTime) + 10,
      width: durationWidth - 20 > cardMinWidth ? durationWidth : cardMinWidth,
      top: 10,
      count: item.length,
      isAllCheckout,
    };
  },
  );
}

function openBookingsBox(bookings: any) {
  isBookingsBoxOpen.value = true;
  bookingsInBox.value = bookings;
}

function updateSelectedDate(date: string) {
  selectedDate.value = date;
  router.push({ query: { date } });
}

// machine
const displayMachineList = computed(() => optionStore.machineList.filter(m => selectedMachines.value.includes(m.id)));
function getMachineAppointment(scope: any) {
  const machineId = scope.resource.id;

  const bookings = appointmentStore.machineOnlyAppointment.filter(item => item.machines[0].id === machineId);
  const bookingGroup = bookings.reduce((acc, item) => {
    const startTime = item.scheduleStartTime;
    const group = acc[startTime] ?? [];
    group.push(item);
    return { ...acc, [startTime]: group };
  }, {} as Record<string, MachineSchedule[]>);

  return Object.values(bookingGroup).map((item) => {
    const { scheduleStartTime, scheduleEndTime } = item[0];
    const isAllCheckout = item.every(el => el.paymentState === PaymentState['已結帳']);
    const duration = getDuration(scheduleStartTime, scheduleEndTime, 'm');
    const durationWidth = scope.timeDurationWidth(duration) - 20;
    const cardMinWidth = 105;

    return {
      bookings: item,
      left: scope.timeStartPosX(scheduleStartTime) + 10,
      width: durationWidth - 20 > cardMinWidth ? durationWidth : cardMinWidth,
      top: 10,
      bottom: 10,
      count: item.length,
      isAllCheckout,
      showMachineCard: item[0].userShift.type !== ShiftType['G動椅'], // 除G動椅預約單外其他都顯示灰色儀器卡片
    };
  },
  );
}
</script>

<template>
  <div class="calendar-view">
    <section class="appointment_calendar">
      <ResourceCalendar
        :model-value="selectedDate"
        :model-resources="appointmentStore.activeUsers"
        :interval-start="16"
        :interval-count="30"
        :interval-minutes="30"
        :resource-width="200"
        animated
        @model-resources="appointmentStore.users = $event"
        @update:model-value="updateSelectedDate"
      >
        <template #nav-right>
          <div class="payment-indicator">
            <div class="payment-indicator__item">結帳</div>
            <div class="payment-indicator__item--unpaid">未結帳</div>
          </div>
        </template>
        <template #intervals="{ scope }">
          <template
            v-for="(item, idx) in getBookings(scope)"
            :key="idx"
          >
            <AppointmentCard
              v-if="item.count === 1"
              :data="item.bookings[0]"
              :style="getStyle(item)"
              @click="router.push({ name: 'appointmentListInfo', params: { scheduleId: item.bookings[0].id } })"
            />
            <AppointmentCountCard
              v-else
              :style="getStyle(item)"
              :count="item.count"
              :is-checkout="item.isAllCheckout"
              @click="() => openBookingsBox(item.bookings)"
            />
          </template>
        </template>
        <template #resource-label="{ scope }">
          <ResourceLabel :name="scope.resource.name" :shifts="appointmentStore.resourceLabels[scope.resource.id]" />
        </template>
      </ResourceCalendar>
    </section>
    <section class="device_container">
      <MultiOptionSelect
        v-model="selectedMachines"
        class="device_select"
        label="儀器"
        :options="machineOptions"
      />
      <MachineCalendar
        class="calendar" :model-value="selectedDate" :model-resources="displayMachineList" :resource-width="200"
        :interval-start="16"
        :interval-count="30"
        :interval-minutes="30"
      >
        <template #intervals="{ scope }">
          <template
            v-for="(item, idx) in getMachineAppointment(scope)"
            :key="idx"
          >
            <MachineCard
              v-if="item.showMachineCard"
              :data="item.bookings[0]"
              :style="getStyle(item)"
            />
            <AppointmentCard
              v-else-if="item.count === 1"
              :data="item.bookings[0]"
              :style="getStyle(item)"
              @click="router.push({ name: 'appointmentListInfo', params: { scheduleId: item.bookings[0].id } })"
            />
            <div v-else>
              <AppointmentCountCard
                :style="getStyle(item)"
                :count="item.count"
                :is-checkout="item.isAllCheckout"
                @click="() => openBookingsBox(item.bookings)"
              />
            </div>
          </template>
        </template>
      </MachineCalendar>
    </section>
    <QDialog v-model="isBookingsBoxOpen">
      <div class="bookings-box">
        <div v-close-popup class="bookings-box__close">
          <QIcon name="close" size="24px" />
        </div>
        <AppointmentCard
          v-for="(booking, idx) in bookingsInBox"
          :key="idx"
          :data="booking"
          @click="router.push({ name: 'appointmentListInfo', params: { scheduleId: booking.id } })"
        />
      </div>
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.calendar-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  .appointment_calendar {
    flex: 1 1 60%;
    height: 0;
  }
  .device_container {
    flex: 1 1 40%;
    height: 0;
    .device_select {
      margin-bottom: 20px;
    }
    .calendar {
      height: calc(100% - 60px);
    }
  }
}
.payment-indicator {
  display: flex;
  gap: 21px;
  &__item {
    display: flex;
    align-items: center;
    gap: 7px;
    &::before {
      content: '';
      display: block;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #a5d6f1;
    }
    &--unpaid {
      @extend .payment-indicator__item;
      &::before {
        background-color: #f8c9cb;
      }
    }
  }
}

.bookings-box {
  display: flex;
  gap: 20px;
  padding: 50px 30px 30px;
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}

:deep(.q-calendar-resource__resource--text) {
  height: 100%;
  flex-grow: 1;
  padding: 0 !important;
}
</style>
