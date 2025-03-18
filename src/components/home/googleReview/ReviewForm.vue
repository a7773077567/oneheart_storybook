<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { GoogleReview } from '@/api';
import { computed, ref } from 'vue';
import type { RoleType } from '@/api/user';
import dayjs from 'dayjs';

const props = defineProps<{
  type: T;
  initVals?: T extends 'edit' ? GoogleReview : null;
  role: RoleType;
}>();

defineEmits<{
  (e: 'cancel', state: boolean): void;
}>();

const schema = z.object({
  userId: z.number(),
  title: z.string(),
  reviewScreenshot: z.string(),
  reviewDate: z.string(),
  reviewTime: z.string(),
});

const newUploadPhoto = ref(null);
const initialValues = computed(() => {
  if (props.type === 'edit')
    return props.initVals;

  return {
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewTime: dayjs().format('hh:mm'),
  };
});
// const files = computed(()=> props.initVals.reviewScreenshot)
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (values) => {
  console.log(values, newUploadPhoto.value);
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
        <OSelect name="userId" label="治療者(得分者)*" error-message="" />
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
      <QBtn flat rounded label="取消" class="q-mr-sm" @click="$emit('cancel', false)" />
      <QBtn rounded color="primary" label="確定" @click="onSubmit" />
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
