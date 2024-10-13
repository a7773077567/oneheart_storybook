<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAppointmentStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { AppointmentCard, AppointmentCountCard, ResourceLabel } from '@/components/appointment';
import { useRouter } from 'vue-router';
import type { ClientSchedule } from '@/api';
import { useQuasar } from 'quasar';
import { getDuration } from '@/utils/date';

const $q = useQuasar();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);
const isBookingsBoxOpen = ref(false);
const bookingsInBox = ref<any[]>();

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
watchEffect(async () => {
  $q.loading.show();
  await appointmentStore.getClientSchedulesInProgress(selectedDate.value);
  await appointmentStore.getShifts({ startDate: selectedDate.value, endDate: selectedDate.value, userIds: appointmentStore.activeUsers.map(item => item.id) });
  $q.loading.hide();
});

function getStyle(item: any) {
  return {
    position: 'absolute',
    left: `${item.left}px`,
    width: `${item.width - 1}px`,
    top: `${item.top}px`,
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
    const isAllCheckout = item.every(el => el.paymentState === 2);
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
</script>

<template>
  <div class="calendar-view">
    <ResourceCalendar
      v-model="selectedDate"
      :model-resources="appointmentStore.activeUsers"
      :interval-start="16"
      :interval-count="30"
      :interval-minutes="30"
      animated
      @model-resources="appointmentStore.users = $event"
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
