<script setup lang="ts">
import type { ShiftTemplate } from '@/api/shift';
import { ShiftItem } from '@/components/shift';
import { ref } from 'vue';

interface Props {
  data: ShiftTemplate[];
}

defineProps<Props>();
const emit = defineEmits<{
  confirm: [shiftTemplate: ShiftTemplate];
}>();

const selectedTemplate = ref<ShiftTemplate | null>(null);

function selectShift(shiftTemplate: ShiftTemplate) {
  selectedTemplate.value = shiftTemplate;
}

function confirm() {
  emit('confirm', selectedTemplate.value!);
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
        v-for="(item, idx) in data"
        :key="idx"
        :data="item"
        :class="{ active: selectedTemplate?.id === item.id }"
        @click="() => selectShift(item)"
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
