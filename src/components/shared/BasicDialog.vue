<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title: string;
  content?: string;
  confirmMode?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  closeLabel?: string;
}>(), {
  confirmMode: false,
  confirmLabel: '確定',
  cancelLabel: '取消',
  maxWidth: '800px',
  closeLabel: '關閉',
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <QDialog v-model="model" persistent>
    <div class="dialog" :style="{ maxWidth }">
      <div class="dialog__header">
        <div class="title">{{ title }}</div>
      </div>
      <div class="dialog__body">
        <slot name="default">{{ content }}</slot>
      </div>
      <div class="dialog__actions">
        <QBtn v-if="!confirmMode" :label="closeLabel" color="primary" padding="10px 24px" class="btn" @click="model = false" />
        <div v-else class="edit-btns">
          <QBtn :label="cancelLabel" color="primary" padding="10px 24px" flat @click="model = false, $emit('cancel')" />
          <QBtn :label="confirmLabel" color="primary" padding="10px 24px" class="btn" @click="$emit('confirm')" />
        </div>
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

.btn {
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

.edit-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
