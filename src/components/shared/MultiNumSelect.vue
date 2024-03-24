<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { getSequenceOptions } from '@/utils/helpers';

interface Item {
  count: number;
  label?: string;
}

interface Props {
  items: Item[];
  name?: string;
  modelValue?: number[];
  customRule?: any;
  disable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: number[]];
}>();

const { value: fieldValue, setValue } = useField<number[]>(() => props.name || '', props.customRule);
const model = computed(() => props.modelValue || fieldValue.value);

function updateModel(idx: number, val: number) {
  const newModel = [...model.value.slice(0, idx), val, ...model.value.slice(idx + 1)];
  if (!props.modelValue) {
    setValue(newModel);
  }
  emit('update:modelValue', newModel);
}
</script>

<template>
  <div class="multiple-select">
    <template v-for="(item, idx) in items" :key="idx">
      <QSelect
        :model-value="model[idx]"
        :options="getSequenceOptions(item.count)"
        emit-value
        outlined
        dense
        :disable="disable"
        class="multiple-select__item"
        @update:model-value="val => updateModel(idx, val)"
      />
      <span v-if="!!item.label">{{ item.label }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.multiple-select {
  display: flex;
  align-items: center;
  gap: 9px;
  &__item {
    max-width: 114px;
    flex: 1 1 0;
  }
}
</style>
