<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  score: number;
  fullInfo?: boolean;
  caption?: string;
}>();

const lightSignals = computed(() => [
  { name: 'red', isMeet: props.score < 40 },
  { name: 'yellow', isMeet: props.score >= 40 && props.score < 60 },
  { name: 'green', isMeet: props.score >= 60 },
]);
</script>

<template>
  <div class="signal" :class="{ signal_detail: fullInfo }">
    <div v-if="fullInfo" class="signal__header">
      {{ caption }}
    </div>
    <div class="signal__content">
      <span class="label">{{ label }}{{ score }}分</span>
      <div class="light-container">
        <div v-for="light in lightSignals" :key="light.name" class="light" :class="[light.name, { isChecked: light.isMeet }]">
          <QIcon v-if="light.isMeet" name="check" size="18px" color="white" />
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
  }
}
.signal {
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
    @include label-large($on-surface);
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
    .label {
      @include title-medium($on-surface-variant);
    }
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
