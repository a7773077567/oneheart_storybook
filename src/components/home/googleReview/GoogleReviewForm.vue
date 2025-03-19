<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { type GoogleReview, createGoogleReview, getGoogleUploadURL, upload2awsS3 } from '@/api';
import { computed, ref } from 'vue';
import { RoleType } from '@/api/user';
import dayjs from 'dayjs';
import { extractUuidFromS3Url } from '@/utils/helpers';

const props = defineProps<{
  type: T;
  initVals?: T extends 'edit' ? GoogleReview : null;
  role: RoleType;
  therapistOptions: { label: string; value: number }[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create'): void;
}>();

const schema = z.object({
  userId: z.number(),
  title: z.string(),
  reviewDate: z.string(),
  reviewTime: z.string(),
});

const newUploadPhoto = ref<null | File>(null);
const initialValues = computed(() => {
  if (props.type === 'edit')
    return props.initVals;

  return {
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewTime: dayjs().format('hh:mm'),
    userId: props.role === RoleType['物理治療師'] ? props.therapistOptions[0].value : undefined,
  };
});

const { handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues.value,
});
const ifDisableSubmit = computed(() => {
  if (props.type === 'add' && !newUploadPhoto.value)
    return false;
  return meta.value.valid;
});

const onSubmit = handleSubmit(async (values) => {
  let fileUUID = null;
  // upload img first
  try {
    if (newUploadPhoto.value) {
      const { fileName, url, maxFileSizeInMB } = await getGoogleUploadURL({ userId: values.userId });
      await upload2awsS3(url, newUploadPhoto.value, maxFileSizeInMB);
      fileUUID = extractUuidFromS3Url(fileName);
      if (!fileUUID)
        throw new Error('no file');
    }

    await createGoogleReview({
      reviewScreenshot: fileUUID as string,
      reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm:ss'),
      userId: values.userId,
      title: values.title,
    });
    emit('create');
  }
  catch (error) {
    console.error('Error during submission:', error);
  }
});

function replaceUpload(scope: any) {
  scope.removeQueuedFiles();
}
</script>

<template>
  <QCard class="google_review_form">
    <QCardSection class="q-pa-lg">
      <h2 class="google_review_form--title">{{ type === 'add' ? '上傳 Google 評論' : '編輯 Google 評論' }}</h2>
    </QCardSection>
    <QCardSection class="q-pa-lg">
      <form>
        <OInput name="title" inside-label="項目名稱*" error-message="" />
        <OSelect name="userId" label="治療者(得分者)*" error-message="" :options="therapistOptions" />
        <OInput date-mode name="reviewDate" inside-label="上傳日期*" mask="date" :rules="['date']" />
        <OTime name="reviewTime" now-btn label="上傳時間" error-message="" />

        <QUploader
          flat
          style="max-width: 300px"
          :multiple="false"
          :max-files="1"
          :files="[]"
          @added="newUploadPhoto = $event"
        >
          <template #header="scope">
            <QBtn v-if="scope.canAddFiles || scope.canUpload" unelevated rounded color="blue-1" text-color="dark" icon="add" label="上傳截圖" @click="scope?.queuedFiles?.length >= 1 ? replaceUpload(scope) : scope.pickFiles">
              <QUploaderAddTrigger />
            </QBtn>
            <p v-if="scope?.queuedFiles?.length === 0" style="color: rgba(69, 70, 79, 1)" class="q-mt-md">*必填。每次限傳一張，格式須為 JPG 或 PNG，檔案大小不得超過 1MB</p>
          </template>
        </QUploader>
      </form>
    </QCardSection>
    <QCardSection class="q-pa-lg row justify-end">
      <QBtn flat rounded label="取消" class="q-mr-sm" @click="$emit('close')" />
      <QBtn :disable="ifDisableSubmit" rounded color="primary" label="確定" @click="onSubmit" />
    </QCardSection>
  </QCard>
</template>

<style scoped lang="scss">
.google_review_form {
  min-width: 480px;
  &--title {
    @include headline-small($on-surface);
  }
  :deep(.q-uploader) {
    .q-uploader__header {
      position: relative;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      background-color: transparent !important;
      color: transparent;
    }
  }
}
</style>
