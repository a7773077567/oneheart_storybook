<script setup lang="ts">
import { ref } from 'vue';
import { BookingAdder, BookingBox } from '@/components/appointment';
import { getBookingItems } from '@/mocks/handlers/appointment';
import { useAppointmentStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();

await appointmentStore.getUsers([userStore.currentSpace!]);

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const BookingItems = getBookingItems();
const stateOfBookingDialog = ref(false);

function getStyle(event: any) {
  return {
    position: 'absolute',
    left: `${event.left}px`,
    width: `${event.width - 1}px`,
  };
}

function getBookings(scope: any) {
  const employeeId = scope.resource.id;
  const bookings = BookingItems.filter(item => item.employee.id === employeeId);

  return bookings.map(item => ({
    ...item,
    left: scope.timeStartPosX(item.time),
    width: scope.timeDurationWidth(60),
    canBook: item.available && !item.isBooked,
  }));
}

function OpenBookingDialog(targetUserShiftId: number) {
  appointmentStore.targetUserShiftId = targetUserShiftId;
  stateOfBookingDialog.value = true;
}

function book() {
  stateOfBookingDialog.value = false;
  $q.dialog({
    message: '預約成功',
  });
}
</script>

<template>
  <div class="booking-calendar">
    <ResourceCalendar
      v-model="selectedDate"
      v-model:model-resources="appointmentStore.users"
    >
      <template #intervals="{ scope }">
        <BookingAdder
          v-for="(item, idx) in getBookings(scope)"
          :key="idx"
          :disable="!item.canBook"
          :style="getStyle(item)"
          @add="() => OpenBookingDialog(item.id)"
        />
      </template>
    </ResourceCalendar>
    <QDialog v-model="stateOfBookingDialog" persistent>
      <BookingBox @book="book" />
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
