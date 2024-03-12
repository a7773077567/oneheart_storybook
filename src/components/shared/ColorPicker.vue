<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
  colors: string[];
  modelValue?: string;
  name?: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: string];
}>();

const { value: fieldValue, setValue } = useField<string>(() => props.name || 'field');

function updateModel(color: string) {
  setValue(color);
  emit('update:modelValue', fieldValue.value);
}
</script>

<template>
  <div class="color-picker">
    <span
      v-for="(color, idx) in colors"
      :key="idx"
      class="color-picker__item"
      :class="{ 'color-picker__item--active': color === fieldValue }"
      :style="{ background: color }"
      @click="() => updateModel(color)"
    />
  </div>
</template>

<style lang="scss" scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 28px;
  &__item {
    width: 20px;
    height: 20px;
    display: grid;
    place-content: center;
    border-radius: 50%;
    cursor: pointer;
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      box-shadow: 0 0 0 2px white;
      border-radius: 50%;
      scale: 0;
      transition: 120ms scale ease-in-out;
    }
    &--active::before {
      scale: 1;
    }
  }
}
</style>
