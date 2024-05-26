<script setup lang='ts'>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

defineProps<{
  modelValue: boolean;
  title: string;
  content: string;
}>();
defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'ok'): void;
  (e: 'hide'): void;
  (e: 'cancel'): void;
}>();

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
</script>

<template>
  <QDialog ref="dialogRef" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <QCard>
      <QCardSection class="row items-center q-pb-none">
        <div class="text-h6">
          {{ title }}
        </div>
        <QSpace />
        <QBtn v-close-popup icon="close" flat round dense @click="onDialogHide" />
      </QCardSection>

      <QCardSection>
        {{ content }}
      </QCardSection>

      <QCardActions vertical class="q-pa-lg add_association_dialog__actions">
        <QBtn label="確定" color="black" @click="onDialogOK" />
        <QBtn label="取消" @click="onDialogHide" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
