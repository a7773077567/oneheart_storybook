<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  labelSize?: number | string;
  labelWeight?: number | string;
}
const props = defineProps<Props>();

const labelSize = computed(() => `${props.labelSize}px`);
const labelWeight = computed(() => props.labelWeight || 700);
</script>

<template>
  <div class="input-box">
    <p class="input-box__label">
      {{ label }}
    </p>
    <div class="input-box__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-box {
  &__label {
    margin-bottom: 8px;
    font-weight: v-bind('labelWeight');
    font-size: v-bind('labelSize');
  }
  &__body {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
:slotted(.q-field) {
  flex: 1 1 auto;
}
</style>
