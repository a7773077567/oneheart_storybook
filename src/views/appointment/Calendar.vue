<script setup lang="ts">
import { ref } from 'vue';
import { useAppointmentStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { BookingCard } from '@/components/appointment';
import { getBookingItems } from '@/mocks/handlers/appointment';
import { useRouter } from 'vue-router';

const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpace!]);

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const bookingItems = getBookingItems();

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
  const bookings = bookingItems.filter(item => item.employee.id === employeeId && !item.available);
  return bookings.map(item => ({
    ...item,
    left: scope.timeStartPosX(item.time) + 10,
    width: scope.timeDurationWidth(60),
    top: 10,
  }));
}
</script>

<template>
  <ResourceCalendar
    v-model="selectedDate"
    v-model:model-resources="appointmentStore.users"
  >
    <template #intervals="{ scope }">
      <BookingCard
        v-for="(item, idx) in getBookings(scope)"
        :key="idx"
        :data="item"
        :style="getStyle(item)"
        @click="router.push({ name: 'appointmentInfo', params: { type: item.type } })"
      />
    </template>
  </ResourceCalendar>
</template>

<style lang="scss" scoped>

</style>
