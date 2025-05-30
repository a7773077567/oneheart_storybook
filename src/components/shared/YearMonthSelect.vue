<!-- eslint-disable vue/valid-v-slot -->
<script setup lang="ts">
import dayjs from 'dayjs';
import { QMenu } from 'quasar';
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: { year: number; month: number };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: { year: number; month: number }): void;
}>();

const monthOptions = Array.from({ length: 12 }, (_, idx) => ({ label: `${idx + 1} 月`, value: idx }));
const yearOptions = getYearOptions(props.modelValue.year);

const state = reactive({
  monthOpened: true,
  selectedMonth: props.modelValue.month,
  yearOpened: false,
  selectedYear: props.modelValue.year,
  menuOpened: false,
});

const inputText = computed(() => `${state.selectedYear}年${dayjs().month(state.selectedMonth).format('M')}月`);

watch(() => state.monthOpened, (newVal) => {
  if (newVal) {
    state.yearOpened = false;
  }
});

watch(() => state.yearOpened, (newVal) => {
  if (newVal) {
    state.monthOpened = false;
  }
});

function getYearOptions(currentYear: number) {
  const pastYears = 20;

  return Array.from({ length: pastYears }, (_, idx) => currentYear - idx)
    .map(year => ({ label: `${year} 年`, value: year }));
}

function onConfirm() {
  emit('update:modelValue', { year: state.selectedYear, month: state.selectedMonth });
  resetState();
}

function onCancel() {
  state.selectedMonth = props.modelValue.month;
  state.selectedYear = props.modelValue.year;
  resetState();
}

function resetState() {
  state.monthOpened = true;
  state.menuOpened = false;
  state.yearOpened = false;
}
</script>

<template>
  <div :class="[state.menuOpened ? 'input--active' : 'input']">
    <div :class="[state.menuOpened ? 'input__label--active' : 'input__label']">月份</div>
    <div :class="[state.menuOpened ? 'input__text--active' : 'input__text']">{{ inputText }}</div>
    <div class="input__calendar">
      <QIcon name="o_calendar_month" size="24px" color="on-surface-variant" />
    </div>
  </div>

  <QMenu v-model="state.menuOpened" target=".input" fit :offset="[0, 1]">
    <div id="year-month-select-menu" class="menu">
      <div class="menu__header">
        <div
          class="menu__select"
          @click="state.monthOpened = !state.monthOpened"
        >
          <span>{{ `${state.selectedMonth + 1} 月` }}</span>
          <QIcon
            name="arrow_drop_down"
            size="18px"
            :style="state.monthOpened ? 'transform: rotate(180deg);' : ''"
          />
        </div>
        <div
          class="menu__select"
          @click="state.yearOpened = !state.yearOpened"
        >
          <span>{{ `${state.selectedYear} 年` }}</span>
          <QIcon
            name="arrow_drop_down"
            size="18px"
            :style="state.yearOpened ? 'transform: rotate(180deg);' : ''"
          />
        </div>
      </div>

      <ul class="menu__list">
        <template v-if="state.monthOpened">
          <li
            v-for="(item, idx) in monthOptions"
            :key="idx"
            :class="[item.value === state.selectedMonth ? 'menu__list-item--active' : 'menu__list-item']"
            @click="state.selectedMonth = item.value"
          >
            <div class="menu__list-check">
              <QIcon
                v-show="item.value === state.selectedMonth" name="o_check"
                size="24px"
              />
            </div>
            <span>{{ item.label }}</span>
          </li>
        </template>
        <template v-if="state.yearOpened">
          <li
            v-for="(item, idx) in yearOptions"
            :key="idx"
            :class="[item.value === state.selectedYear ? 'menu__list-item--active' : 'menu__list-item']"
            @click="state.selectedYear = item.value"
          >
            <div class="menu__list-check">
              <QIcon
                v-show="item.value === state.selectedYear" name="o_check"
                size="24px"
              />
            </div>
            <span>{{ item.label }}</span>
          </li>
        </template>
      </ul>

      <div class="menu__actions">
        <QBtn label="取消" flat @click="onCancel" />
        <QBtn label="確定" flat @click="onConfirm" />
      </div>
    </div>
  </QMenu>
</template>

<style lang="scss" scoped>
.input {
  padding: 4px 16px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1px solid $outline;
  cursor: pointer;

  &:hover {
    border-color: $primary;
    .input__label {
      color: $primary;
    }
    .input__text {
      color: $outline;
    }
  }

  &--active {
    @extend .input;
    outline: 1px solid $primary;
  }

  &__label {
    @include text-style($body-small, $on-surface-variant);

    &--active {
      @extend .input__label;
      color: $primary;
    }
  }

  &__text {
    @include text-style($body-large, $on-surface);

    &--active {
      @extend .input__text;
      color: $outline;
    }
  }

  &__calendar {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
  }
}

.menu {
  height: 476px;
  border-radius: 16px;
  background-color: $on-surface-bright;
  display: flex;
  flex-direction: column;
  &__header {
    padding: 12px 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid $outline-variant;
  }

  &__select {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 10px 8px;
    > span {
      @include text-style($label-large, $on-surface-variant);
    }

    .q-icon {
      transition: all 150ms ease;
    }
  }

  &__list {
    height: calc(100% - 124px);
    padding: 8px 0 20px 0;
    overflow: scroll;
  }

  &__list-item {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: background-color 150ms ease;
    &:hover {
      background-color: #1d1b2014;
    }

    > span {
      @include text-style($body-large, $on-surface);
    }

    &--active {
      @extend .menu__list-item;
      background-color: #1a7ab314 !important;
    }
  }

  &__list-check {
    flex: 0 0 24px;
  }

  &__actions {
    padding: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

:global(.q-menu:has(#year-month-select-menu)) {
  border-radius: 16px;
  overflow: visible;
}

:deep(.q-field__native) {
  @include text-style($body-large, $outline);
}

:deep(.q-field__control) {
  border-radius: 8px !important;
}

:deep(.q-btn .block) {
  @include text-style($label-large, $primary);
}
</style>
