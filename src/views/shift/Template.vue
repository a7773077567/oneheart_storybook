<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { ShiftCard, ShiftEditor } from '@/components/shift';
import { type ShiftTemplateReq, createShiftTemplate, deleteShift, fetchShiftTemplate, updateShift } from '@/api/shift';
import { useShiftStore } from '@/stores';
import { storeToRefs } from 'pinia';

const shiftStore = useShiftStore();
const { shiftTemplates, targetShift } = storeToRefs(shiftStore);
const { getShiftTemplates } = shiftStore;
const $q = useQuasar();
const isCreatingShift = ref(false);
const isUpdatingShift = ref(false);

getShiftTemplates();

async function onCreateShiftTemplate(values: ShiftTemplateReq) {
  await createShiftTemplate(values);
  getShiftTemplates();
  isCreatingShift.value = false;
}

async function openShift(templateId: number) {
  targetShift.value = await fetchShiftTemplate(templateId);
  isUpdatingShift.value = true;
}

async function onUpdateShift(values: ShiftTemplateReq) {
  await updateShift(targetShift.value!.id, values);
  await getShiftTemplates();
  isUpdatingShift.value = false;
}

async function onDeleteShift(shiftId: number) {
  $q.dialog({
    title: '確認刪除',
    message: '是否要刪除此筆班別?',
  }).onOk(async () => {
    await deleteShift(shiftId);
    getShiftTemplates();
  });
}
</script>

<template>
  <main class="shift">
    <div class="shift__header row justify-between items-center gutter">
      <h2 class="text-h6">
        新增班表
      </h2>
      <QBtn label="新增" icon="add" outline @click="isCreatingShift = true" />
      <QDialog v-model="isCreatingShift" persistent>
        <ShiftEditor @cancel="isCreatingShift = false" @confirm="onCreateShiftTemplate" />
      </QDialog>
      <QDialog v-model="isUpdatingShift" persistent>
        <ShiftEditor :data="targetShift" @cancel="isUpdatingShift = false" @confirm="(values) => onUpdateShift(values)" />
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
