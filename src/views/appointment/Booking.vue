<script setup lang="ts">
import { BookingCalendar, BookingQuery } from '@/components/appointment';
import { useAppointmentStore } from '@/stores';
import { storeToRefs } from 'pinia';

const appointmentStore = useAppointmentStore();
const { querySent } = storeToRefs(appointmentStore);
</script>

<template>
  <BookingQuery v-if="!querySent" />
  <BookingCalendar v-else />
</template>

<style lang="scss" scoped>
.booking {
  width: 356px;
  padding: 20px;
}
</style>
