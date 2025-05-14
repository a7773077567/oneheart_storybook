<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean; // show amount
  amount: number;
  dotNumber: number;
  label?: string;
  visibilityToggle?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const displayContent = computed(() => {
  return props.modelValue
    ? props.amount.toLocaleString('en', { currency: 'USD', style: 'currency' })
    : Array(props.dotNumber).fill('•').join('');
});
</script>

<template>
  <div class="display">
    <p class="display__content">
      <span v-if="!!label">{{ `${label} ` }}</span>
      <span :class="[amount < 0 && modelValue ? 'display__amount--negative' : 'display__amount']">{{ displayContent }}</span>
    </p>
    <div
      v-if="visibilityToggle"
      class="display__visibility"
    >
      <QIcon
        :name="modelValue ? 'o_visibility' : 'o_visibility_off'"
        size="24px"
        @click="$emit('update:modelValue', !modelValue)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.display {
  display: flex;
  align-items: center;
  gap: 8px;

  &__content {
    span {
      @include text-style($headline-small, $on-surface);
    }
  }

  &__amount {
    &--negative {
      @extend .display;
      color: $error !important;
    }
  }

  &__visibility {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    background-color: $secondary-container;
    cursor: pointer;
  }
}
</style>
