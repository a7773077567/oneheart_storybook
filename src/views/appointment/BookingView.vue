<script setup lang="ts">
import { AppointmentQuery, AppointmentQueryCalendar } from '@/components/appointment';
import { useAppointmentStore } from '@/stores';

const appointmentStore = useAppointmentStore();
</script>

<template>
  <AppointmentQuery v-if="!appointmentStore.querySent" />
  <AppointmentQueryCalendar v-else />
</template>

<style lang="scss" scoped>
.booking {
  width: 356px;
  padding: 20px;
}
</style>
