<script setup lang="ts">
import type { ShiftTemplate } from '@/api/shift';
import { ShiftItem } from '@/components/shift';
import { ref } from 'vue';

interface Props {
  data: ShiftTemplate[];
}

defineProps<Props>();
const emit = defineEmits<{
  confirm: [shiftId: number[]];
}>();

const selected = ref<Set<number>>(new Set());

function selectShift(shiftId: number) {
  const exist = selected.value.has(shiftId);
  if (!exist) {
    selected.value.add(shiftId);
    return;
  }
  selected.value.delete(shiftId);
}

function confirm() {
  emit('confirm', [...selected.value]);
}
</script>

<template>
  <QCard>
    <QCardSection class="row flex-center relative-position q-py-sm ">
      <div class="text-subtitle1 text-weight-bold">
        選擇班別
      </div>
      <QIcon v-close-popup name="close" size="24px" class="absolute-right cursor-pointer" style="top:50%; translate: -16px -50%;" />
    </QCardSection>
    <QCardSection class="column q-gutter-md">
      <ShiftItem
        v-for="(shift, idx) in data"
        :key="idx"
        :data="shift"
        :class="{ active: selected.has(shift.id) }"
        @click="() => selectShift(shift.id)"
      />
      <QBtn label="新增" class="self-center" outline style="width: 126px" @click="confirm" />
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
  .active {
  background-color: #ddd;
}
</style>
