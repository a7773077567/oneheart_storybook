<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { ShiftCard, ShiftTemplateEditor } from '@/components/shift';
import { type CreateShiftTemplate, createShiftTemplate, deleteShiftTemplate, fetchShiftTemplate, updateShiftTemplate } from '@/api/shift';
import { useShiftStore } from '@/stores';
import { ShiftType } from '@/const/general';

const shiftStore = useShiftStore();
const $q = useQuasar();
const isEditorOpen = ref(false);
const isEditMode = ref(false);

shiftStore.getShiftTemplates();

async function onEditorConfirm(values: CreateShiftTemplate) {
  if (isEditMode.value) {
    await updateShiftTemplate(shiftStore.targetShiftTemplate!.id, values);
  }
  else {
    await createShiftTemplate(values);
  }
  await shiftStore.getShiftTemplates();
  isEditorOpen.value = false;
  isEditMode.value = false;
  shiftStore.targetShiftTemplate = null;
}

function openEditor() {
  isEditMode.value = false;
  isEditorOpen.value = true;
}

async function openEditorInEditMode(templateId: number) {
  shiftStore.targetShiftTemplate = await fetchShiftTemplate(templateId);
  isEditMode.value = true;
  isEditorOpen.value = true;
}

async function onDeleteShift(shiftTemplateId: number) {
  $q.dialog({
    title: '確認刪除',
    message: '是否要刪除此筆班別?',
  }).onOk(async () => {
    await deleteShiftTemplate(shiftTemplateId);
    shiftStore.getShiftTemplates();
  });
}

function closeShiftTemplateEditor() {
  isEditorOpen.value = false;
  shiftStore.targetShiftTemplate = null;
}

const shiftOptions = computed(() => shiftStore.spaceShiftOptions.filter(shift => shift.value !== ShiftType['G動椅']));
</script>

<template>
  <main class="shift">
    <div class="shift__header">
      <h2 class="text-h6">
        新增班表
      </h2>
      <QBtn label="新增" icon="add" outline @click="openEditor" />
      <QDialog v-model="isEditorOpen" persistent>
        <ShiftTemplateEditor :data="shiftStore.targetShiftTemplate" :shift-type-options="shiftOptions" @cancel="isEditorOpen = false" @confirm="onEditorConfirm" @close="closeShiftTemplateEditor" />
      </QDialog>
    </div>
    <div class="shift__body ">
      <ShiftCard v-for="shift in shiftStore.shiftTemplates" :key="shift.id" :data="shift" flat style="border: 1px solid #79747E;" @edit="openEditorInEditMode" @delete="onDeleteShift" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.shift {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
