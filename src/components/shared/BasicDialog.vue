<script setup lang="ts">
import type { QDialogProps } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  confirmMode?: boolean;
}>();

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
    <div class="dialog">
      <div class="dialog__header">
        <div class="title">{{ title }}</div>
      </div>
      <div class="dialog__body">
        <slot />
      </div>
      <div class="dialog__actions">
        <QBtn v-if="!confirmMode" label="關閉" color="primary" padding="10px 24px" class="btn" @click="model = false" />
        <div v-else class="edit-btns">
          <QBtn label="取消" color="primary" padding="10px 24px" flat @click="model = false, $emit('cancel')" />
          <QBtn label="確定" color="primary" padding="10px 24px" class="btn" @click="$emit('confirm')" />
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
