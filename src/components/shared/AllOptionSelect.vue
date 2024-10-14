<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: QSelectProps['modelValue'];
  options: QSelectProps['options'];
  label: QSelectProps['label'];
}>();

const emit = defineEmits<{
  'update:modelValue': [val: QSelectProps['modelValue']];
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const isAllCheck = ref<null | boolean>(null);

watch(isAllCheck, (newVal, oldVal) => {
  if (newVal === oldVal) {
    return;
  }
  if (newVal === false) {
    model.value = [];
    return;
  }
  if (newVal === true) {
    model.value = props.options?.map(item => item.value);
  }
});

watch(() => props.modelValue.length, (newVal) => {
  if (newVal === 0) {
    isAllCheck.value = false;
    return;
  }
  if (newVal === props.options?.length) {
    isAllCheck.value = true;
    return;
  }

  isAllCheck.value = null;
}, { immediate: true });

const popupStyle = {
  width: '280px',
  background: '#F8FBFF',
};

const selectStyle = computed(() => {
  return {
    'width': model.value.length ? '148px' : '123px',
    'background': model.value.length ? '#DFECFF' : '#FFFFFF',
    'border-radius': '8px',
  };
});

const displayValue = computed(() =>
  model.value.length === props.options?.length
    ? `所有${props.label}`
    : model.value.length === 0
      ? ''
      : props.options?.filter(option => model.value.includes(option.value)).map(option => option.label));
</script>

<template>
  <QSelect
    v-model="model"
    v-bind="$attrs"
    dense
    emit-value
    map-options
    multiple
    borderless
    :outlined="!model.length"
    :label="model.length ? undefined : label"
    :options="options"
    :popup-content-style="popupStyle"
    :style="selectStyle"
    :display-value="displayValue"
  >
    <template #option="{ opt, selected, itemProps, toggleOption }">
      <QItem v-bind="itemProps" @click="() => toggleOption(opt.value)">
        <QCheckbox :model-value="selected" :label="opt.label" class="checkbox" @click="() => toggleOption(opt.value)" />
      </QItem>
    </template>

    <template #before-options>
      <QItem clickable dense @click="isAllCheck = !isAllCheck">
        <QCheckbox v-model="isAllCheck" label="全選" class="checkbox" />
      </QItem>
    </template>

    <template #prepend>
      <QIcon v-if="model.length" name="check" size="18px" style="color: rgba(26, 24, 51, 1)" />
    </template>
  </QSelect>
</template>

<style lang="scss" scoped>
.checkbox {
  gap: 16px;
}
:deep(.q-checkbox__label) {
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
  padding-right: 8px;
}

:deep(.q-field__prepend) {
  padding-left: 8px;
}
</style>
