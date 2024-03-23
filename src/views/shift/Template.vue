<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { ShiftCard, ShiftEditor } from '@/components/shift';
import { type ShiftTemplateReq, createShiftTemplate, deleteShiftTemplate, fetchShiftTemplate, updateShiftTemplate } from '@/api/shift';
import { useShiftStore } from '@/stores';
import { storeToRefs } from 'pinia';

const shiftStore = useShiftStore();
const { shiftTemplates, targetShiftTemplate } = storeToRefs(shiftStore);
const { getShiftTemplates } = shiftStore;
const $q = useQuasar();
const isCreatingShiftTemplate = ref(false);
const isUpdatingShiftTemplate = ref(false);

getShiftTemplates();

async function onCreateShiftTemplate(values: ShiftTemplateReq) {
  await createShiftTemplate(values);
  getShiftTemplates();
  isCreatingShiftTemplate.value = false;
}

async function openShift(templateId: number) {
  targetShiftTemplate.value = await fetchShiftTemplate(templateId);
  isUpdatingShiftTemplate.value = true;
}

async function onUpdateShiftTemplate(values: ShiftTemplateReq) {
  await updateShiftTemplate(targetShiftTemplate.value!.id, values);
  await getShiftTemplates();
  targetShiftTemplate.value = null;
  isUpdatingShiftTemplate.value = false;
}

async function onDeleteShift(shiftTemplateId: number) {
  $q.dialog({
    title: '確認刪除',
    message: '是否要刪除此筆班別?',
  }).onOk(async () => {
    await deleteShiftTemplate(shiftTemplateId);
    getShiftTemplates();
  });
}

function cancelUpdatingShiftTemplate() {
  isUpdatingShiftTemplate.value = false;
  targetShiftTemplate.value = null;
}
</script>

<template>
  <main class="shift">
    <div class="shift__header row justify-between items-center gutter">
      <h2 class="text-h6">
        新增班表
      </h2>
      <QBtn label="新增" icon="add" outline @click="isCreatingShiftTemplate = true" />
      <QDialog v-model="isCreatingShiftTemplate" persistent>
        <ShiftEditor @cancel="isCreatingShiftTemplate = false" @confirm="onCreateShiftTemplate" />
      </QDialog>
      <QDialog v-model="isUpdatingShiftTemplate" persistent>
        <ShiftEditor :data="targetShiftTemplate" @cancel="cancelUpdatingShiftTemplate" @confirm="(values) => onUpdateShiftTemplate(values)" />
      </QDialog>
    </div>
    <div class="shift__body column q-gutter-sm">
      <ShiftCard
        v-for="shift in shiftTemplates"
        :key="shift.id"
        :data="shift"
        flat
        style="border: 1px solid #79747E;"
        @edit="openShift"
        @delete="onDeleteShift"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
