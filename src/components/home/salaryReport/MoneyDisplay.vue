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
    ? props.amount.toLocaleString('en', { currency: 'USD', style: 'currency', minimumFractionDigits: 0 })
    : Array(props.dotNumber).fill('•').join('');
});

const amountClass = computed(() => {
  return props.amount < 0 && props.modelValue
    ? 'display__amount--negative'
    : props.amount === 0 && props.modelValue
      ? 'display__amount--zero'
      : 'display__amount';
});
</script>

<template>
  <div class="display">
    <p class="display__content">
      <span v-if="!!label">{{ `${label} ` }}</span>
      <span v-if="!modelValue">$</span>
      <span :class="amountClass">{{ displayContent }}</span>
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
      @extend .display__amount;
      color: $error !important;
    }

    &--zero {
      @extend .display__amount;
      opacity: 0.38;
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
    transition: all 150ms ease;
    &:hover {
      filter: brightness(0.9);
    }
  }
}
</style>
