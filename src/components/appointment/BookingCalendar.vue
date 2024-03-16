<script setup lang="ts">
import { ref } from 'vue';
import { BookingAdder } from '@/components/appointment';
import { getBookingItems } from '@/mocks/handlers/appointment';
import { useAppointmentStore } from '@/stores';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';

const appointmentStore = useAppointmentStore();
const { therapists } = storeToRefs(appointmentStore);
const { getTherapists } = appointmentStore;
await getTherapists(1);

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const BookingItems = getBookingItems();

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
    left: scope.timeStartPosX(item.time),
    width: scope.timeDurationWidth(60),
    canBook: item.available && !item.isBooked,
  }));
}
</script>

<template>
  <ResourceCalendar
    v-model="selectedDate"
    v-model:model-resources="therapists"
  >
    <template #intervals="{ scope }">
      <BookingAdder
        v-for="(item, idx) in getBookings(scope)"
        :key="idx"
        :disable="!item.canBook"
        :style="getStyle(item)"
      />
    </template>
  </ResourceCalendar>
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
