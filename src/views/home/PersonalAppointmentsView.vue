<script setup lang="ts">
import { CalendarMonth, CaseCompletionIndicator } from '@/components/shared';
import { PersonalAppointmentCard, PersonalAppointmentDialog } from '@/components/home/dashboard';
import { today } from '@quasar/quasar-ui-qcalendar';
import { computed, ref } from 'vue';
import { useDashboardStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import type { ChangeParam, ClickDateParam, ClickDayParam } from '@/types/calendar';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const dashboardStore = useDashboardStore();
const selectedDate = ref(route.query.date as string ?? today());
const isAppointmentDialogOpen = ref(false);
const appointmentDialogData = computed(() => getDaySchedules(selectedDate.value));

async function onChange(data: ChangeParam) {
  try {
    $q.loading.show();
    await dashboardStore.getUserInProgressClientSchedules({ startDate: data.start, endDate: data.end });
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
}

function selectDate(data: ClickDateParam | ClickDayParam) {
  if (data.scope.outside) {
    return;
  }
  const date = data.scope.timestamp.date;
  selectedDate.value = date;
  router.push({ query: { date } });
  isAppointmentDialogOpen.value = true;
}

function getDaySchedules(date: string) {
  return dashboardStore.userInProgressClientSchedules.filter(item => item.date === date).sort((a, b) => {
    const [aHr, aMin] = a.scheduleStartTime.split(':');
    const [bHr, bMin] = b.scheduleStartTime.split(':');
    const aDate = dayjs({ h: aHr, m: aMin });
    const bDate = dayjs({ h: bHr, m: bMin });

    return aDate.isBefore(bDate) ? -1 : 1;
  });
}
</script>

<template>
  <div class="personal-appointments">
    <CalendarMonth
      v-model="selectedDate"
      @change="onChange"
      @click-date="selectDate"
      @click-day="selectDate"
    >
      <template #header-right>
        <CaseCompletionIndicator />
      </template>

      <template #day="{ scope }">
        <PersonalAppointmentCard
          v-if="getDaySchedules(scope.timestamp.date).length"
          :data="getDaySchedules(scope.timestamp.date)"
        />
      </template>
    </CalendarMonth>

    <PersonalAppointmentDialog
      v-model="isAppointmentDialogOpen"
      :data="appointmentDialogData"
      @choose="id => $router.push({ name: 'appointmentListInfo', params: { scheduleId: id } })"
    />
  </div>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}
.personal-appointments {
  display: flex;
  flex-direction: column;
  gap: 20px;
  &__nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}
</style>
