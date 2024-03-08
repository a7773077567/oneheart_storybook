<script setup lang="ts">
import { computed, ref } from 'vue';
import { ShiftEditor } from '@/components/shift';
import { type ShiftReq, type ShiftSchema, createShift, getShift, updateShift } from '@/api/shift';
import { useConvert } from '@/composables/helpers';

const { toArray, toObject } = useConvert(['startHr', 'startMin', 'endHr', 'endMin']);

const addingShift = ref(false);
const editingShift = ref(false);
const shift = ref<ShiftReq>();
const shiftData = computed(() => {
  if (!shift.value) {
    return;
  }
  const { duration, unavailable } = shift.value;
  return {
    ...shift.value,
    duration: toArray(duration),
    unavailable: unavailable.map(toArray),
  };
});

async function addShift(values: ShiftSchema) {
  const payload = toShiftPayload(values);
  const { state } = await createShift(payload);
  console.log(state);
}

async function openShift(shiftId: number) {
  const shiftData = await getShift(shiftId);
  shift.value = shiftData;
  editingShift.value = true;
}

async function editShift(shiftId: number, values: ShiftSchema) {
  const payload = toShiftPayload(values);
  const { state } = await updateShift(shiftId, payload);
  console.log(state);
}

function toShiftPayload(values: ShiftSchema) {
  const { duration, unavailable } = values;
  const payload = {
    ...values,
    duration: toObject(duration),
    unavailable: unavailable.map(toObject),
  };
  return payload;
}
</script>

<template>
  <main class="shift">
    <div class="shift__header row justify-between items-center gutter">
      <h2 class="text-h6">
        新增班表
      </h2>
      <QBtn label="新增" icon="add" outline @click="addingShift = true" />
      <QDialog v-model="addingShift" persistent>
        <ShiftEditor @cancel="addingShift = false" @confirm="addShift" />
      </QDialog>
      <QDialog v-model="editingShift" persistent>
        <ShiftEditor :data="shiftData" @cancel="editingShift = false" @confirm="(values) => editShift(1, values)" />
      </QDialog>
    </div>
    <div class="shift__body">
      <QBtn label="修改" icon="edit" outline @click="() => openShift(1)" />
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
