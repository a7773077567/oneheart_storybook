<script setup lang="ts">
import type { QInputProps } from 'quasar';

const props = defineProps<QInputProps>();
</script>

<template>
  <QInput
    v-bind="props"
    outlined
    class="input"
  />
</template>

<style lang="scss" scoped>
.input {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
  :deep(.q-field__control:before) {
    border: 1px solid $outline;
  }
  :deep(.q-field__label) {
    @include text-style($body-small, $on-surface-variant);
  }
  :deep(.q-field__native) {
    @include text-style($body-large, $on-surface);
  }
}
</style>
