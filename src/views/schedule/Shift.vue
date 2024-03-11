<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { ShiftCard, ShiftEditor } from '@/components/shift';
import { type ShiftReq, type ShiftRes, createShift, deleteShift, getShift, getShiftList, updateShift } from '@/api/shift';

const $q = useQuasar();
const creatingShift = ref(false);
const updatingShift = ref(false);
const shiftList = ref<ShiftRes[]>();
const targetShift = ref<ShiftRes>();

getAllShifts();

async function getAllShifts() {
  shiftList.value = await getShiftList();
}

async function onCreateShift(values: ShiftReq) {
  await createShift(values);
  creatingShift.value = false;
}

async function openShift(shiftId: number) {
  targetShift.value = await getShift(shiftId);
  updatingShift.value = true;
}

async function onUpdateShift(values: ShiftReq) {
  await updateShift(values.id!, values);
  await getAllShifts();
  updatingShift.value = false;
}

async function onDeleteShift(shiftId: number) {
  $q.dialog({
    title: '確認刪除',
    message: '是否要刪除此筆班別?',
  }).onOk(async () => {
    await deleteShift(shiftId);
    getAllShifts();
  });
}
</script>

<template>
  <main class="shift">
    <div class="shift__header row justify-between items-center gutter">
      <h2 class="text-h6">
        新增班表
      </h2>
      <QBtn label="新增" icon="add" outline @click="creatingShift = true" />
      <QDialog v-model="creatingShift" persistent>
        <ShiftEditor @cancel="creatingShift = false" @confirm="onCreateShift" />
      </QDialog>
      <QDialog v-model="updatingShift" persistent>
        <ShiftEditor :data="targetShift" @cancel="updatingShift = false" @confirm="(values) => onUpdateShift(values)" />
      </QDialog>
    </div>
    <div class="shift__body column q-gutter-sm">
      <ShiftCard
        v-for="shift in shiftList"
        :key="shift.id"
        :shift="shift"
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
