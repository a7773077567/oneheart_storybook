<script setup lang="ts">
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';
import { computed, ref } from 'vue';
import { getWeekDay } from '@/utils/date';
import { useDashboardStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const dashboardStore = useDashboardStore();
const calendar = ref<QCalendarMonth | null>(null);
const selectedDate = ref(route.query.date as string ?? today());
const isMiniMode = ref(false);
const targetSchedules = computed(() => {
  return dashboardStore.userPersonalSchedules.filter(item => item.date === selectedDate.value);
});

function onMiniMode(val: boolean) {
  isMiniMode.value = val;
}

async function onChange(data: any) {
  await dashboardStore.getUserInProgressClientSchedules({ startDate: data.start, endDate: data.end });
}

function selectDate(data: any) {
  const date = data.scope.timestamp.date;
  selectedDate.value = date;
  router.push({ query: { date } });
}

function calcAmount(date: string) {
  return dashboardStore.userPersonalSchedules.reduce((acc, item) => {
    return item.date === date ? ++acc : acc;
  }, 0);
}
</script>

<template>
  <div class="personal-appointments">
    <div class="personal-appointments__nav">
      <DatePicker v-model="selectedDate" />
      <CalendarNav
        @prev="calendar?.prev"
        @today="calendar?.moveToToday"
        @next="calendar?.next"
      />
    </div>

    <div class="personal-appointments__calendar">
      <QCalendarMonth
        ref="calendar"
        v-model="selectedDate"
        mini-mode="auto"
        :breakpoint="550"
        animated
        bordered
        day-type="square"
        :day-height="60"
        @mini-mode="onMiniMode"
        @change="onChange"
        @click-date="selectDate"
        @click-day="selectDate"
      >
        <template #day="{ scope }">
          <div v-if="calcAmount(scope.timestamp.date) > 0" class="day">
            <div v-if="isMiniMode" class="dot--mini" />
            <QAvatar v-else color="grey" text-color="white" size="22px">{{ calcAmount(scope.timestamp.date) }}</QAvatar>
          </div>
        </template>
        <template #head-day="{ scope: { timestamp } }">
          <div class="row flex-center q-py-xs">
            <span class="text-weight-bold">{{ getWeekDay(timestamp.weekday) }}</span>
          </div>
        </template>
      </QCalendarMonth>
    </div>
    <div class="personal-appointments__list">
      <QList v-if="targetSchedules.length" bordered separator>
        <QItem v-for="(item, idx) in targetSchedules" :key="idx" v-ripple clickable @click="$router.push({ name: 'appointmentListInfo', params: { scheduleId: item.scheduleId } })">
          <QItemSection thumbnail>
            <QChip color="grey-8" text-color="white" class="q-ma-none">{{ item.spaceName }}</QChip>
          </QItemSection>
          <QItemSection>
            <QItemLabel caption>{{ item.typeName }}</QItemLabel>
            <QItemLabel class="text-primary"> {{ item.time }}</QItemLabel>
          </QItemSection>
          <QItemSection>
            <QItemLabel caption>客戶名稱</QItemLabel>
            <QItemLabel>{{ item.clientName }}</QItemLabel>
          </QItemSection>
          <QItemSection>
            <QItemLabel caption>客戶電話</QItemLabel>
            <QItemLabel>{{ item.clientPhone }}</QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.personal-appointments {
  padding: 20px;
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

.day {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #808080;
  border-radius: 50%;
  &--mini {
    @extend .dot;
    width: 6px;
    height: 6px;
  }
}

.list {
  &__item {
  }
}

:deep(.q-calendar-month__day) {
  cursor: pointer;
  transition: background-color 200ms ease;
  &:hover {
    background-color: #eee;
  }
}

:deep(.q-calendar-month__day--content) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 6px;
}

:deep(.q-item) {
  gap: 60px;
}

:deep(.q-item__section--main) {
  flex: 0 1 auto;
}

:deep(.q-calendar-month__day--label) {
  cursor: pointer;
}

:deep(.q-calendar-month__day--label) {
  border-radius: 3px;
}

:deep(.q-item__section--thumbnail) {
  margin: 0 !important;
  padding: 0;
}
</style>
