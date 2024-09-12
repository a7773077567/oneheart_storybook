<script setup lang="ts">
import type { GroupShiftTemplate, ShiftTemplate } from '@/api/shift';
import { ShiftItem } from '@/components/shift';
import { ref } from 'vue';

defineProps<{
  data: (ShiftTemplate | GroupShiftTemplate)[];
  hintMessage: string;
}>();
const emit = defineEmits<{
  confirm: [shiftTemplate: ShiftTemplate | GroupShiftTemplate];
  close: [];
}>();

const selectedTemplate = ref<ShiftTemplate | GroupShiftTemplate | null>(null);

function selectShift(shiftTemplate: ShiftTemplate | GroupShiftTemplate) {
  selectedTemplate.value = shiftTemplate;
}

function confirm() {
  emit('confirm', selectedTemplate.value!);
}
</script>

<template>
  <div class="shift-selector">
    <div class="shift-selector__header">
      <p class="title">選擇班別</p>
      <QIcon name="close" size="24px" class="close" @click="$emit('close')" />
    </div>
    <QSeparator style="background-color: #79747E;" />
    <div class="shift-selector__body">
      <div class="shifts">
        <ShiftItem
          v-for="(item, idx) in data"
          :key="idx"
          :data="item"
          :class="[selectedTemplate?.id === item.id ? 'shifts__item--active' : 'shifts__item']"
          class=""
          @click="() => selectShift(item)"
        />
      </div>
      <p v-if="hintMessage" class="hint">{{ hintMessage }}</p>
      <QBtn label="新增" outline class="confirm" @click="confirm" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shift-selector {
  background-color: #fff;
  &__header {
    position: relative;
    padding: 14px 0;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 0 4px 20px;
  }
}

.title {
  text-align: center;
  font-size: 17px;
  font-weight: 500;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}

.shifts {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 400px;
  overflow-y: scroll;
  padding: 20px 16px 0;
  transition: background-color 200ms ease;
  &__item {
    &:hover {
      background-color: #ddd;
    }
    &--active {
      @extend .shifts__item;
      background-color: #ddd;
    }
  }
}

.hint {
  padding-left: 20px;
  color: #d81717;
}
.confirm {
  width: 126px;
  align-self: center;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
</style>
