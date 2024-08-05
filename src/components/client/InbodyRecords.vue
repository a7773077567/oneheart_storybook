<script setup lang='ts'>
import { useClientStore } from '@/stores';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import UploadFileForm from './UploadFileForm.vue';
import { uploadInbodyFile } from '@/api';
import { extractUuidFromS3Url } from '@/utils/helpers';

const props = defineProps<{
  clientId: string;
}>();

const clientStore = useClientStore();
const inbodyFiles = computed(() => clientStore.targetClient?.inBodyFiles ?? []);
const inbodyFileUrls = computed(() => clientStore.targetClient?.inBodyFileUrls ?? []);

const showUpload = ref(false);

function previewFile(url: string) {
  if (!url)
    return;

  window.open(url);
}

async function handleUpload(file: File) {
  const fileName = await clientStore.uploadInbody2S3(+props.clientId, file);
  await uploadInbodyFile(+props.clientId, { fileName: extractUuidFromS3Url(fileName) ?? '' });
  showUpload.value = false;
  clientStore.getClientInfo(+props.clientId);
}
</script>

<template>
  <div>
    <div class="flex justify-end q-mb-md">
      <QBtn outline label="上傳身體組成表" icon="o_add" @click="showUpload = true" />
    </div>
    <QList class="rounded-borders points_group_list" bordered separator>
      <QItem v-for="(file, index) in inbodyFiles" :key="file.createdAt" switch-toggle-side dense-toggle expand-icon-class="toggle_avatar">
        <QItemSection class="points_group_list__header" click>
          {{ dayjs(file.createdAt).format('YYYY/MM/DD') }}
        </QItemSection>
        <QItemSection side>
          <QBtn round flat icon="o_attach_file" @click="previewFile(inbodyFileUrls[index])" />
        </QItemSection>
      </QItem>
    </QList>
  </div>
  <QDialog v-model="showUpload">
    <UploadFileForm @upload="handleUpload" @cancel="showUpload = false" />
  </QDialog>
</template>

<style scoped lang="scss">

</style>
