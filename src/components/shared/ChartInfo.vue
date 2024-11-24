<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    color: string;
    label: string;
    values: string[];
  }[];
  caption?: string;
  showScroll?: boolean;
}>();

const count = computed(() => `共 ${props.data.length} 項`);

const gridTemplateColumns = computed(() => {
  if (!props.data || !props.data.length) {
    return `repeat(2, auto)`;
  }
  return `repeat(${2 + props.data[0].values.length}, auto)`;
});
</script>

<template>
  <div class="info">
    <div :class="[showScroll ? 'info__body--scroll' : 'info__body']">
      <template v-for="({ color, label, values }, idx) in data" :key="idx">
        <div class="info__indicator" :style="{ background: color }" />
        <div class="info__label">{{ label }}</div>
        <div
          v-for="(value, valueIdx) in values"
          :key="valueIdx"
          :class="[valueIdx === values.length - 1 ? 'info__value--percentage' : 'info__value']"
        >
          {{ value }}
        </div>
      </template>
    </div>
    <div v-if="showScroll" class="info__count">{{ count }}</div>
    <div v-if="caption" class="info__caption">{{ caption }}</div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  width: fit-content;

  &__body {
    display: grid;
    grid-template-columns: v-bind('gridTemplateColumns');
    grid-auto-columns: auto;
    column-gap: 8px;
    row-gap: 8px;
    align-items: center;
    margin-bottom: 12px;
    &--scroll {
      @extend .info__body;
      max-height: 144px;
      overflow-y: scroll;
      padding: 0 24px 12px 0;
      border-bottom: 1px solid rgba(219, 218, 231, 1);
      margin-bottom: 8px;
    }
  }
  &__indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: red;
  }

  &__label {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }

  &__value {
    justify-self: end;
    text-align: right;
    min-width: 48px;
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
    &--percentage {
      @extend .info__value;
      color: #1a1b21;
      font-size: 16px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.5px;
    }
  }

  &__count {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
    margin-bottom: 12px;
  }

  &__caption {
    color: #45464f;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }
}
</style>
