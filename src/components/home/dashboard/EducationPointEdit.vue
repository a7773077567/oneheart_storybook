<script setup lang="ts">
import type { TherapistEducationPoint } from '@/types/home/dashboard/admin';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: TherapistEducationPoint;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: TherapistEducationPoint): void;
}>();

const model = ref({ ...props.modelValue });
watch(() => props.modelValue, (newVal) => {
  model.value = { ...newVal };
});
const isDialogOpen = ref(false);

function onSave() {
  emit('update:modelValue', {
    predictedEducationPoint: +model.value.predictedEducationPoint,
    currentEducationPoint: +model.value.currentEducationPoint,
  });
  isDialogOpen.value = false;
}

function onCancel() {
  model.value = { ...props.modelValue };
  isDialogOpen.value = false;
}
</script>

<template>
  <div class="education">
    <div class="education__label">教育積分填寫</div>
    <div class="education__items">
      <div class="education__item">
        <div class="education__item-label">預測教育積分</div>
        <div class="education__item-value">{{ modelValue.predictedEducationPoint }}</div>
      </div>
      <div class="education__item">
        <div class="education__item-label">目前教育積分</div>
        <div class="education__item-value">{{ modelValue.currentEducationPoint }}</div>
      </div>
      <QBtn icon="o_edit" flat round class="education__edit" @click="isDialogOpen = true" />
    </div>

    <QDialog v-model="isDialogOpen">
      <div class="edit">
        <div class="edit__title">教育積分填寫</div>
        <div class="edit__body">
          <QInput v-model="model.predictedEducationPoint" label="預測教育積分" outlined />
          <QInput v-model="model.currentEducationPoint" label="目前教育積分" outlined />
        </div>
        <div class="edit__actions">
          <QBtn label="取消" color="primary" flat class="cancel" @click="onCancel" />
          <QBtn label="儲存" color="primary" class="save" @click="onSave" />
        </div>
      </div>
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.education {
  padding: 12px 0;
  &__label {
    color: #1a1b21;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.15px;
    margin-bottom: 12px;
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    align-items: center;
  }

  &__item-label {
    color: #45464f;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.4px;
  }

  &__item-value {
    color: #1a1b21;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.5px;
  }
}
.edit {
  width: 480px;
  background-color: white;
  border-radius: 28px;

  &__title {
    padding: 24px;
    color: #1a1b21;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
  }

  &__body {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 24px 24px 24px 16px;
  }
}

.save {
  border-radius: 100px;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field__label) {
  color: #45464f;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.4px;
}

:deep(.q-field__native) {
  color: #1a1b21;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0.5px;
}
</style>
