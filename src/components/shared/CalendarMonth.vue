<script setup lang="ts">
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';
import { computed, ref } from 'vue';
import { CalendarNavigation } from '@/components/shared';
import type { ChangeParam, ClickDateParam, ClickDayParam, DayScope, HeadDayScope } from '@/types/calendar';

const props = withDefaults(defineProps<{
  modelValue: string;
}>(), {
  modelValue: today(),
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: ChangeParam): void;
  (e: 'clickDate', val: ClickDateParam): void;
  (e: 'clickDay', val: ClickDayParam): void;
}>();

defineSlots<{
  day(props: { scope: DayScope }): void;
  'head-day'(props: { scope: HeadDayScope }): void;
  'header-left'(): void;
  'header-right'(): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const calendar = ref<QCalendarMonth | null>(null);

function getWeekDay(weekDay: number) {
  const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  return weekDays[weekDay];
}
</script>

<template>
  <div class="calendar-month">
    <div class="calendar-month__header">
      <div class="calendar-month__header-left">
        <slot name="header-left" />
      </div>
      <CalendarNavigation
        v-model="model"
        @today="calendar?.moveToToday"
        @prev="calendar?.prev"
        @next="calendar?.next"
      />
      <div class="calendar-month__header-right">
        <slot name="header-right" />
      </div>
    </div>
    <div class="calendar-month__body">
      <QCalendarMonth
        ref="calendar"
        v-model="model"
        :breakpoint="550"
        animated
        bordered
        day-type="square"
        :day-height="88"
        @change="(val: ChangeParam) => $emit('change', val)"
        @click-date="(val: ClickDateParam) => $emit('clickDate', val)"
        @click-day="(val: ClickDayParam) => $emit('clickDay', val)"
      >
        <template v-if="$slots.day" #day="{ scope }">
          <slot name="day" :scope="scope" />
        </template>
        <template #head-day="{ scope }: {scope: HeadDayScope}">
          <slot name="head-day" :scope="scope">
            <div class="row flex-center q-py-xs">
              <span class="text-weight-bold">{{ getWeekDay(scope.timestamp.weekday) }}</span>
            </div>
          </slot>
        </template>
      </QCalendarMonth>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}

.calendar-month {
  &__header {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include mobile {
      justify-content: center;
    }
  }
  &__header-left {
    @include mobile {
      display: none;
    }
  }
  &__header-right {
    @include mobile {
      display: none;
    }
  }
}

:deep(.q-calendar) {
  border-radius: 8px;
}

:deep(.q-calendar-month__head--weekday) {
  border-right: 0;
  > .row {
    padding: 8px 10px;
  }
  span {
    color: #1a1b21;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
}

:deep(.q-calendar-month__day) {
  padding: 4px;
  transition: background-color 200ms ease;
}

:deep(.q-calendar-month__day--label__wrapper) {
  padding: 4px;
  justify-content: flex-start;
}

:deep(.q-calendar-month__day--label) {
  width: 32px;
  height: 32px;
  color: #1a1b21;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.4px;
}

:deep(.q-calendar-month__day--label) {
  cursor: pointer;
}

:deep(.q-calendar-month__day.q-active-date .q-calendar__button) {
  border: 1px solid rgba(26, 122, 179, 1);
  color: rgba(26, 122, 179, 1);
  background-color: transparent;
}

:deep(.q-calendar-month__day:has(.q-calendar-month__day--content > *)) {
  cursor: pointer;
}

:deep(.q-calendar-month__day:not(:has(.q-calendar-month__day--content > div))) {
  pointer-events: none;
}

:deep(.q-calendar-month__day:has(.q-calendar-month__day--content > *):hover) {
  background-color: rgba(26, 122, 179, 0.08);
}

:deep(
    .q-calendar-month__day.q-current-day:not(.q-active-date) .q-calendar__button
  ) {
  border: none;
}
</style>
