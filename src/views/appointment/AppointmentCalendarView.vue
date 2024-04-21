<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAppointmentStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { AppointmentCard } from '@/components/appointment';
import { useRouter } from 'vue-router';

const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpace!]);

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
watchEffect(() => appointmentStore.getClientSchedulesInProgress(selectedDate.value));

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
  return bookings.map(item => ({
    ...item,
    left: scope.timeStartPosX(item.scheduleStartTime) + 10,
    width: scope.timeDurationWidth(60),
    top: 10,
  }));
}
</script>

<template>
  <ResourceCalendar
    v-model="selectedDate"
    v-model:model-resources="appointmentStore.users"
    :interval-start="8"
    :interval-count="15"
  >
    <template #nav-right>
      <div class="payment-indicator">
        <div class="payment-indicator__item">
          結帳
        </div>
        <div class="payment-indicator__item--unpaid">
          未結帳
        </div>
      </div>
    </template>
    <template #intervals="{ scope }">
      <AppointmentCard
        v-for="(item, idx) in getBookings(scope)"
        :key="idx"
        :data="item"
        :style="getStyle(item)"
        @click="router.push({ name: 'appointmentInfo', params: { scheduleId: item.id } })"
      />
    </template>
  </ResourceCalendar>
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
</style>
