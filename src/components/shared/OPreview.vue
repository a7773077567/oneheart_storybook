<script setup lang='ts'>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  label: string;
}>();

const { value } = useField<string | null>(() => props.name || '', undefined, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});

function previewFile() {
  if (!value.value)
    return;

  window.open(value.value);
}
</script>

<template>
  <div class="o_preview">
    <QBtn @click="previewFile">
      <QIcon name="attach_file" />
      <span class="q-ml-xs">
        {{ label ?? '附件資料' }}
      </span>
    </QBtn>
    <QBtn round flat class="q-ml-sm" size="sm" color="grey" @click="value = null">
      <QIcon class="removal" name="o_delete" />
    </QBtn>
  </div>
</template>

<style scoped lang="scss">
.o_preview {
  display: flex;
  align-items: center;
  cursor: pointer;
  :deep(.q-btn__content) > * {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
