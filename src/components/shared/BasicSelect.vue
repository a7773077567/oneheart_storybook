<script setup lang="ts">
import type { QSelectProps } from 'quasar';

const props = defineProps<QSelectProps>();
</script>

<template>
  <QSelect
    v-bind="props"
    outlined
    class="select"
  />
</template>

<style lang="scss" scoped>
.select {
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
