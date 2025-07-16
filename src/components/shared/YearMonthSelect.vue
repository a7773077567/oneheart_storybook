<!-- eslint-disable vue/valid-v-slot -->
<script setup lang="ts">
import dayjs from 'dayjs';
import { QMenu } from 'quasar';
import { computed, reactive, watch } from 'vue';

interface Selection { year: number; month: number }
const props = defineProps<{
  modelValue: Selection | Selection[];
  monthOptions?: { label: string; value: number }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Selection | Selection[]): void;
}>();

const isMultiSelectMode = computed(() => Array.isArray(props.modelValue));

const monthOptions = computed(() => props.monthOptions || Array.from({ length: 12 }, (_, idx) => ({ label: `${idx + 1} 月`, value: idx + 1 })));
const yearOptions = getYearOptions(dayjs().year());

const state = reactive({
  menuOpened: false,
  view: 'month' as 'month' | 'year',
  currentViewYear: dayjs().year(),
  tempSelections: [] as Selection[],
  tempSelectedYear: dayjs().year(),
  tempSelectedMonth: dayjs().month() + 1,
});

const inputText = computed(() => {
  if (isMultiSelectMode.value) {
    const selections = props.modelValue as Selection[];
    if (!selections || selections.length === 0)
      return '選擇月份';
    return selections
      .map(sel => `${sel.year}年${sel.month}月`)
      .join('、');
  }
  const selection = props.modelValue as Selection;
  return `${selection.year ?? dayjs().year()}年${(selection.month ?? dayjs().month())}月`;
});

const currentYearText = computed(() => `${state.currentViewYear} 年`);

const currentMonthText = computed(() => {
  if (isMultiSelectMode.value) {
    return '選擇月份';
  }
  return `${state.tempSelectedMonth} 月`;
});

watch(() => state.menuOpened, (isOpen) => {
  if (isOpen) {
    if (isMultiSelectMode.value) {
      state.tempSelections = JSON.parse(JSON.stringify(props.modelValue as Selection[]));
      const selections = props.modelValue as Selection[];
      state.currentViewYear = selections.length > 0 ? selections[selections.length - 1].year : dayjs().year();
    }
    else {
      const selection = props.modelValue as Selection;
      state.tempSelectedYear = selection.year ?? dayjs().year();
      state.tempSelectedMonth = selection.month ?? dayjs().month() + 1;
      state.currentViewYear = selection.year ?? dayjs().year();
    }
    state.view = 'month';
  }
});

function getYearOptions(currentYear: number) {
  const pastYears = 20;
  return Array.from({ length: pastYears }, (_, idx) => currentYear - idx)
    .map(year => ({ label: `${year} 年`, value: year }));
}

function isYearSelected(year: number): boolean {
  if (isMultiSelectMode.value) {
    return state.tempSelections.some(sel => sel.year === year);
  }
  return state.tempSelectedYear === year;
}

function isMonthSelected(month: number): boolean {
  if (isMultiSelectMode.value) {
    return state.tempSelections.some(sel => sel.year === state.currentViewYear && sel.month === month);
  }
  return state.currentViewYear === state.tempSelectedYear && state.tempSelectedMonth === month;
}

function handleMonthClick(month: number) {
  if (isMultiSelectMode.value) {
    const selection: Selection = { year: state.currentViewYear, month };
    const index = state.tempSelections.findIndex(s => s.year === selection.year && s.month === selection.month);
    if (index > -1) {
      state.tempSelections.splice(index, 1);
    }
    else {
      state.tempSelections.push(selection);
    }
  }
  else {
    state.tempSelectedYear = state.currentViewYear;
    state.tempSelectedMonth = month;
  }
}

function handleYearClick(year: number) {
  state.currentViewYear = year;
  if (!isMultiSelectMode.value) {
    state.tempSelectedYear = year;
  }
  state.view = 'month';
}

function onConfirm() {
  if (isMultiSelectMode.value) {
    const sortedSelections = [...state.tempSelections].sort((a, b) => a.year - b.year || a.month - b.month);
    emit('update:modelValue', sortedSelections);
  }
  else {
    emit('update:modelValue', { year: state.tempSelectedYear, month: state.tempSelectedMonth });
  }
  state.menuOpened = false;
}

function onCancel() {
  state.menuOpened = false;
}
</script>

<template>
  <div v-bind="$attrs" :class="[state.menuOpened ? 'input--active' : 'input']">
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
          @click="state.view = 'month'"
        >
          <span>{{ currentMonthText }}</span>
          <QIcon
            name="arrow_drop_down"
            size="18px"
            :style="state.view === 'month' ? 'transform: rotate(180deg);' : ''"
          />
        </div>
        <div
          class="menu__select"
          @click="state.view = 'year'"
        >
          <span>{{ currentYearText }}</span>
          <QIcon
            name="arrow_drop_down"
            size="18px"
            :style="state.view === 'year' ? 'transform: rotate(180deg);' : ''"
          />
        </div>
      </div>

      <ul class="menu__list">
        <template v-if="state.view === 'month'">
          <li
            v-for="(item, idx) in monthOptions"
            :key="idx"
            :class="[isMonthSelected(item.value) ? 'menu__list-item--active' : 'menu__list-item']"
            @click="handleMonthClick(item.value)"
          >
            <div class="menu__list-check">
              <QIcon
                v-show="isMonthSelected(item.value)" name="o_check"
                size="24px"
              />
            </div>
            <span>{{ item.label }}</span>
          </li>
        </template>
        <template v-if="state.view === 'year'">
          <li
            v-for="(item, idx) in yearOptions"
            :key="idx"
            :class="[isYearSelected(item.value) ? 'menu__list-item--active' : 'menu__list-item']"
            @click="handleYearClick(item.value)"
          >
            <div class="menu__list-check">
              <QIcon
                v-show="isYearSelected(item.value)" name="o_check"
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
