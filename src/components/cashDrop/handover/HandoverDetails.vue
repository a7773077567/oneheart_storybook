<script setup lang="ts">
import { HandoverMisc, HandoverTitle } from '@/components/cashDrop';
import { computed } from 'vue';

type HandoverMiscModel = InstanceType<typeof HandoverMisc>['$props']['modelValue'];

const props = defineProps<{
  modelValue: HandoverMiscModel;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: HandoverMiscModel): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <div class="details">
    <div class="details__header">
      <HandoverTitle />
    </div>
    <div class="details__misc">
      <HandoverMisc v-model="model" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details {
  padding-top: 22px;
  &__header {
    margin-bottom: 24px;
  }
  &__misc {
  }
}
</style>
