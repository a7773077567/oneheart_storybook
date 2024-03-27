<script setup lang="ts">
import { BookingCalendar, BookingQuery } from '@/components/appointment';
import { useAppointmentStore } from '@/stores';

const appointmentStore = useAppointmentStore();
</script>

<template>
  <BookingQuery v-if="!appointmentStore.querySent" />
  <BookingCalendar v-else />
</template>

<style lang="scss" scoped>
.booking {
  width: 356px;
  padding: 20px;
}
</style>
