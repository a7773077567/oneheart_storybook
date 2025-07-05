<script setup lang='ts'>
import { useDialogPluginComponent } from 'quasar';

interface DialogProps {
  title: string;
  subtitle?: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  type?: 'confirm' | 'success';
  hideCancel?: boolean;
}

withDefaults(defineProps<DialogProps>(), {
  type: 'success',
  okLabel: '確定',
  cancelLabel: '取消',
});

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'ok'): void;
  (e: 'hide'): void;
  (e: 'cancel'): void;
}>();

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

function onOkClick() {
  onDialogOK();
  onDialogHide();
}
</script>

<template>
  <QDialog ref="dialogRef" :model-value="true" @update:model-value="$emit('update:modelValue', $event)">
    <!-- <QCard style="min-width: 400px;">
      <QCardSection class="row items-center q-pb-none">
        <h3 class="text-h6 q-mx-auto">
          {{ title }}
        </h3>
        <QBtn v-close-popup icon="close" flat round dense @click="onDialogHide" />
      </QCardSection>

      <QCardSection class="q-px-lg">
        <div v-if="type === 'success'" class="text-center q-py-md">
          <span class="material-icons" style="color: #1D9E30; font-size: 64px">check_circle</span>
        </div>
        <p style="white-space: pre-wrap;">{{ message }}</p>
      </QCardSection>

      <hr>

      <QCardActions vertical class="q-pa-lg add_association_dialog__actions">
        <QBtn v-if="!hideCancel" :label="cancelLabel" @click="onDialogHide" />
        <QBtn :label="okLabel" color="black" @click="onOkClick" />
      </QCardActions>
    </QCard> -->
    <div class="dialog">
      <div class="dialog__body">
        <div class="dialog__title">{{ title }}</div>
        <div class="dialog__message">
          <div v-if="subtitle" class="message--title">{{ `${subtitle}\n\n` }}</div>
          <div class="message">{{ message }}</div>
        </div>
      </div>
      <div class="dialog__actions">
        <QBtn v-if="!hideCancel" flat padding="10px 12px" :label="cancelLabel" color="primary" @click="onDialogHide" />
        <QBtn :label="okLabel" flat padding="10px 12px" color="primary" @click="onOkClick" />
      </div>
    </div>
  </QDialog>
</template>

<style scoped lang="scss">
.dialog {
  background-color: #fff;
  min-width: 400px;
  border-radius: 28px;
  &__body {
    padding: 24px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__title {
    @include text-style($headline-small, $on-surface);
    font-size: 20px;
  }
  &__message {
    white-space: pre-wrap;
  }
  &__actions {
    padding: 24px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
  }

  :deep(.q-btn .block) {
    @include text-style($label-large, $primary);
  }
}

.message {
  @include text-style($body-medium, $on-surface-variant);
  &--title {
    @extend .message;
    font-weight: 700;
  }
}
</style>
