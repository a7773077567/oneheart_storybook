<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    name: string;
    label?: string;
    value?: any;
    caption?: string;
    hide?: boolean;
    shrinkFontSize?: boolean;
  }[];
}>();

const showData = computed(() => props.data.filter(item => !item.hide));
</script>

<template>
  <div class="card">
    <slot
      v-for="(item, idx) in showData"
      :key="idx"
      :name="item.name"
      :data="item"
    >
      <div :class="[idx === data.length - 1 ? 'card__item--last' : 'card__item']">
        <div class="card__label">{{ item.label }}</div>
        <div :class="[item.shrinkFontSize ? 'card__value--shrink' : 'card__value']">{{ item.value }}</div>
        <div class="card__caption">{{ item.caption }}</div>
      </div>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  &__item {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 12px;
    row-gap: 8px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(219, 218, 231, 1);
    &--last {
      @extend .card__item;
      border-bottom: none;
    }
  }

  &__label {
    color: #1a1b21;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.15px;
  }

  &__value {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    align-self: center;
    color: #1a1b21;
    font-size: 28px;
    font-weight: 500;
    line-height: 36px;
    &--shrink {
      @extend .card__value;
      font-size: 20px;
    }
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
