<script setup lang="ts">
import type { QDialogProps } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <QDialog v-model="model" persistent>
    <div class="dialog">
      <div class="dialog__header">
        <div class="title">{{ title }}</div>
      </div>
      <div class="dialog__body">
        <slot />
      </div>
      <div class="dialog__actions">
        <QBtn label="關閉" color="primary" padding="10px 24px" class="close" @click="model = false" />
      </div>
    </div>
  </QDialog>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}

.dialog {
  background-color: #fff;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 28px;
  &__header {
    padding: 24px;
  }
  &__body {
    max-height: calc(85vh - 168px);
    padding: 0 24px;
    overflow-y: scroll;
    @include mobile {
      padding: 0 12px;
    }
  }
  &__actions {
    text-align: right;
    padding: 24px;
  }
}

.title {
  color: #1a1b21;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.close {
  padding: 10px 24px;
  border-radius: 100px;
  :deep(.block) {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
}
</style>
