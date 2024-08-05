<script setup lang='ts'>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'upload', file: File): void;
  (e: 'cancel'): void;
}>();

const newInbodyFile = ref<File | null>();

function upload() {
  if (!newInbodyFile.value)
    return;

  emit('upload', newInbodyFile.value);
}
</script>

<template>
  <QCard>
    <QCardSection class="text-center add_association_dialog__header">
      新增Inbody檔案
    </QCardSection>
    <QCardSection class="q-pa-lg">
      <OFile v-model="newInbodyFile" label="選擇檔案" />
    </QCardSection>
    <QCardActions vertical class="q-pa-lg add_association_dialog__actions">
      <QBtn size="md" color="black" label="上傳" :disable="!newInbodyFile" @click.stop="upload" />
      <QBtn size="md" label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
</template>
