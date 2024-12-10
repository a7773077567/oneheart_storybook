<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: QSelectProps['modelValue'];
  options: QSelectProps['options'];
  label?: QSelectProps['label'];
}>();

const emit = defineEmits<{
  'update:modelValue': [val: QSelectProps['modelValue']];
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const popupStyle = {
  width: '280px',
  background: '#F8FBFF',
};

const selectStyle = computed(() => {
  return {
    'width': 'fit-content',
    'background': '#DFECFF',
    'border-radius': '8px',
  };
});
</script>

<template>
  <QSelect
    v-model="model"
    v-bind="$attrs"
    dense
    emit-value
    map-options
    borderless
    :label="model.length ? undefined : label"
    :options="options"
    :style="selectStyle"
    :popup-content-style="popupStyle"
  >
    <template #option="{ opt, itemProps, toggleOption }">
      <QItem v-bind="itemProps" @click="() => toggleOption(opt.value)">
        <QRadio :model-value="model" :val="opt.value" :label="opt.label" class="checkbox" @click="() => toggleOption(opt.value)" />
      </QItem>
    </template>

    <template #prepend>
      <QIcon name="check" size="18px" style="color: rgba(26, 24, 51, 1)" />
    </template>
  </QSelect>
</template>

<style lang="scss" scoped>
.checkbox {
  gap: 16px;
}

:deep(.q-radio) {
  gap: 8px;
}

:deep(.q-radio__label) {
  color: #1a1b21;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0.5px;
}

:deep(.q-field__label) {
  color: #45464f;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
}

:deep(.q-field__native > span) {
  color: #45464f;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
}

:deep(.q-field__append > .q-icon) {
  color: rgba(26, 24, 51, 1);
}

:deep(.q-field__append) {
  padding: 0 8px;
}

:deep(.q-field__prepend) {
  padding: 0 8px;
}
</style>
