<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'today'): void;
  (e: 'prev'): void;
  (e: 'next'): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <div class="calendar-navigation">
    <QBtn label="今天" padding="10px 12px" flat color="primary" @click="$emit('today')" />
    <div class="calendar-navigation__navigator">
      <QBtn icon="chevron_left" padding="12px 12px" flat @click="$emit('prev')" />
      <div class="calendar-navigation__date">
        <div class="calendar-navigation__display">{{ dayjs(model).format('YYYY年M月D日') }}</div>
        <QBtn icon="o_calendar_month" dense flat style="color: rgba(69, 70, 79, 1);">
          <QPopupProxy transition-show="scale" transition-hide="scale">
            <QDate v-model="model" mask="YYYY-MM-DD" />
          </QPopupProxy>
        </QBtn>
      </div>
      <QBtn icon="chevron_right" padding="12px 12px" flat @click="$emit('next')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
  &__navigator {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__date {
    padding: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-evenly;
    width: 240px;
    @include mobile {
      width: 185px;
    }
  }
  &__display {
    color: #1a1b21;
    font-size: 22px;
    font-weight: 500;
    line-height: 28px;
    @include mobile {
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.1px;
    }
  }
}
</style>
