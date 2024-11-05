<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  message?: string;
  cancelBtn?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  fitContent?: boolean;
  width?: string;
}>(), {
  titleAlign: 'left',
  cancelLabel: '返回編輯',
  confirmLabel: '確認',
});

defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <QDialog>
    <div class="generic-dialog" :style="[fitContent && { 'max-width': 'fit-content' }, { width: width ?? undefined }, { 'min-width': width ?? undefined }]">
      <div class="generic-dialog__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="generic-dialog__body">
        <slot name="body">{{ message }}</slot>
      </div>
      <QSeparator style="background-color: #A5A5A5;" class="no-print" />
      <div class="generic-dialog__actions no-print">
        <QBtn v-if="cancelBtn" :label="cancelLabel" outline class="no-print" @click="$emit('cancel')" />
        <QBtn :label="confirmLabel" color="black" class="no-print" @click="$emit('confirm')" />
      </div>
      <QBtn v-close-popup icon="close" size="12px" class="close no-print" flat round dense />
    </div>
  </QDialog>
</template>

<style lang="scss" scoped>
.generic-dialog {
  min-width: 640px;
  background-color: #fff;
  position: relative;
  &__title {
    padding: 24px 24px 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 36px;
  }

  &__body {
    padding: 24px;
    line-height: 24px;
  }

  &__actions {
    padding: 24px;
    display: flex;
    gap: 16px;
  }
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;
}

:deep(.q-btn) {
  font-size: 16px;
  flex-grow: 1;
  .block {
    font-weight: 600;
  }
}
</style>
