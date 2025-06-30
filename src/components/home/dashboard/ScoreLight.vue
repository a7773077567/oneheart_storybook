<script setup lang='ts'>
import { computed } from 'vue';
import type { SignalRange } from '@/api/dashboard';
import { showDecimal } from '@/utils/helpers';

const props = defineProps<{
  label: string;
  score: number;
  fullInfo?: boolean;
  caption?: string;
  noData?: boolean;
  rules: SignalRange[];
}>();

const lightSignals = computed(() => {
  return props.rules.map(range => ({ ...range, isWithin:
    range.min === 0 ? props.score < (range.max ?? 0) : (range.max === null ? props.score >= range.min : props.score > range.min && props.score < range.max) }));
});
const formattedScore = computed(() => showDecimal(props.score, 2));
</script>

<template>
  <div class="signal" :class="{ signal_detail: fullInfo, empty_state: noData }">
    <div v-if="fullInfo" class="signal__header text-label-large text-on-surface">
      {{ caption }}
    </div>
    <div class="signal__content">
      <span class="text-title-medium text-on-surface-variant">{{ label }} {{ noData ? '-' : formattedScore }} 分</span>
      <div class="light-container">
        <div v-for="signal in lightSignals" :key="signal.light" class="light" :class="[signal.light, { isChecked: !noData && signal.isWithin }]">
          <QIcon v-if="!noData && signal.isWithin" name="check" size="18px" color="white" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin light-color($color) {
  border-color: $color;
  &.isChecked {
    background-color: $color;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1 !important;
  }
}
.signal {
  &.empty_state {
    .signal__content {
      background-color: $surface-container;
      .label {
        color: $outline !important;
      }
      .light {
        background-color: $outline !important;
        border-color: $outline !important;
      }
    }
  }
  &_detail {
    background: $surface-container-low;
    border-radius: 24px;
    border: 1px solid $outline-variant;
    width: fit-content;
    padding: 6px 2px 2px;
  }
  &__header {
    text-align: center;
    margin-bottom: 4px;
  }
  &__content {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    border-radius: 100px;
    border: 1px solid $outline-variant;
    background: $on-primary;
    min-width: 275px;
    width: 100%;
    .light-container {
      display: flex;
      gap: 4px;
      margin-left: auto;
      width: fit-content;
      .light {
        width: 24px;
        height: 24px;
        border-width: 2px;
        border-style: solid;
        border-radius: 50px;
        opacity: 0.38;
        &.red {
          @include light-color($error);
        }
        &.yellow {
          @include light-color(#dba100);
        }
        &.green {
          @include light-color(#30b313);
        }
      }
    }
  }
}
</style>
