<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { type GoogleReview, createGoogleReview, getGoogleUploadURL, updateGoogleReview, upload2awsS3 } from '@/api';
import { computed, ref } from 'vue';
import { RoleType } from '@/api/user';
import dayjs from 'dayjs';
import { extractUuidFromS3Url } from '@/utils/helpers';
import { OImgPreview } from '@/components/shared';
import type { QUploader as UploaderScope } from 'quasar';

const props = defineProps<{
  type: T;
  initVals: T extends 'edit' ? FormTypes : null;
  role: RoleType;
  therapistOptions: { label: string; value: number }[];
  reviewId: T extends 'edit' ? number : undefined;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create'): void;
}>();

const schema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  reviewDate: z.string(),
  reviewTime: z.string(),
  reviewScreenshot: z.string(),
});

type FormTypes = typeof schema & { reviewScreenshot?: string | undefined };

const newUploadPhoto = ref<null | File>(null);
const initialValues = computed(() => {
  if (props.type === 'edit')
    return props.initVals;

  return {
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewTime: dayjs().format('HH:mm'),
    userId: props.role === RoleType['物理治療師'] ? props.therapistOptions[0].value : undefined,
  };
});

const { handleSubmit, meta, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues.value,
});

const showFileErrorMsg = ref(false);
function handleUpload([file]: [File]) {
  showFileErrorMsg.value = false;
  newUploadPhoto.value = file;
  const previewURL = URL.createObjectURL(file);
  setFieldValue('reviewScreenshot', previewURL);
}

const ifDisableSubmit = computed(() => {
  if (props.type === 'add' && !newUploadPhoto.value)
    return true;

  if (props.type === 'edit' && (!values?.reviewScreenshot)) {
    return true;
  }

  return !meta.value.valid;
});

const isLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
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

    if (props.type === 'edit' && !!props.reviewId) {
      await updateGoogleReview({ id: props.reviewId }, {
        reviewScreenshot: newUploadPhoto.value ? (fileUUID as string) : extractUuidFromS3Url(values.reviewScreenshot) as string,
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
      });
    }
    else {
      await createGoogleReview({
        reviewScreenshot: fileUUID as string,
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
      });
    }
    isLoading.value = false;
    emit('create');
  }
  catch (error) {
    console.error('Error during submission:', error);
  }
});

function removeImg(scope: UploaderScope) {
  scope.removeQueuedFiles();
  newUploadPhoto.value = null;
  setFieldValue('reviewScreenshot', '');
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
        <Field v-slot="{ field }" name="reviewScreenshot">
          <QUploader
            flat
            style="max-width: 300px"
            :multiple="false"
            :max-files="1"
            accept=".jpg, .pdf, image/*"
            :max-file-size="1048576"
            @added="handleUpload"
            @rejected="showFileErrorMsg = true"
          >
            <template #header="scope">
              <QBtn v-if="scope.canAddFiles || scope.canUpload" unelevated rounded color="blue-1" text-color="dark" icon="add" label="上傳截圖" @click="scope?.queuedFiles?.length >= 1 ? scope.removeQueuedFiles : scope.pickFiles">
                <QUploaderAddTrigger />
              </QBtn>
              <p v-if="showFileErrorMsg" style="color: red">圖片尺寸太大</p>
              <p v-if="!field.value" style="color: rgba(69, 70, 79, 1)" class="q-mt-md">*必填。每次限傳一張，格式須為 JPG 或 PNG，檔案大小不得超過 1MB</p>
            </template>
            <template #list="scope">
              <OImgPreview v-if="field.value" :url="field.value" @remove="removeImg(scope)" />
            </template>
          </QUploader>
        </Field>
      </form>
    </QCardSection>
    <QCardSection class="q-pa-lg row justify-end">
      <QBtn flat rounded label="取消" class="q-mr-sm" @click="$emit('close')" />
      <QBtn :disable="ifDisableSubmit" rounded color="primary" label="確定" :loading="isLoading" @click="onSubmit" />
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
