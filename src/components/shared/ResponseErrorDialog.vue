<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

defineProps<{
  message: string;
  persistent: boolean;
}>();

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>

<template>
  <QDialog ref="dialogRef" :persistent="persistent" @hide="onDialogHide">
    <div class="response-error-hint">
      <div class="response-error-hint__body">
        <div class="title">系統提示</div>
        <div class="message">{{ message }}</div>
      </div>
      <div class="response-error-hint__action">
        <QBtn color="black" label="我瞭解了" :ripple="false" style="width: 100%;" class="got-it" @click="onOKClick" />
      </div>
      <QBtn v-close-popup icon="close" flat class="close" size="12px" dense round />
    </div>
  </QDialog>
</template>

<style lang="scss" scoped>
.response-error-hint {
  width: 422px;
  position: relative;
  background-color: #fff;
  &__body {
    padding: 24px 0 32px 0;
    border-bottom: 1px solid #a5a5a5;
  }
  &__action {
    padding: 24px;
  }
}

.close {
  position: absolute;
  top: 16px;
  right: 12px;
}
.title {
  margin-bottom: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 24px;
}

.message {
  text-align: center;
  font-size: 24px;
}

:deep(.got-it) {
  span.block {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
