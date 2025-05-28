<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { createExpatAllowance, getExpatAllowanceUploadURL, updateExpatAllowance, upload2awsS3 } from '@/api';
import { computed, ref } from 'vue';
import { RoleType } from '@/api/user';
import dayjs from 'dayjs';
import { extractUuidFromS3Url } from '@/utils/helpers';

type FormTypes = typeof schema & { attachment?: string | undefined };
const props = defineProps<{
  type: T;
  initVals?: T extends 'edit' ? FormTypes : null;
  role: RoleType;
  therapistOptions: { label: string; value: number }[];
  bonusId?: T extends 'edit' ? number : undefined;
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
  amount: z.number(),
  attachment: z.string(),
});

const newAttachment = ref<null | File>(null);
const initialValues = computed(() => {
  if (props.type === 'edit')
    return props.initVals;

  return {
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewTime: dayjs().format('HH:mm'),
    userId: props.role === RoleType['物理治療師'] ? props.therapistOptions[0].value : undefined,
    attachment: null,
  };
});

const { handleSubmit, meta, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues.value,
});

const isLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  let fileUUID = null;

  try {
    if (newAttachment.value) {
      const { fileName, url, maxFileSizeInMB } = await getExpatAllowanceUploadURL({ userId: values.userId });
      await upload2awsS3(url, newAttachment.value, maxFileSizeInMB);
      fileUUID = extractUuidFromS3Url(fileName);
      if (!fileUUID)
        throw new Error('no file');
    }

    if (props.type === 'edit' && !!props.bonusId) {
      await updateExpatAllowance(props.bonusId, {
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
        amount: values.amount,
        attachment: newAttachment.value ? (fileUUID as string) : extractUuidFromS3Url(values.attachment) as string,
      });
    }
    else {
      await createExpatAllowance({
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
        amount: values.amount,
        attachment: fileUUID as string,
      });
    }
    isLoading.value = false;
    emit('create');
  }
  catch (error) {
    console.error('Error during submission:', error);
  }
});

function handleUpload(file: File | null) {
  if (!file) {
    newAttachment.value = null;
    return;
  }
  newAttachment.value = file;
  const previewURL = URL.createObjectURL(file);
  setFieldValue('attachment', previewURL);
}
</script>

<template>
  <QCard class="form">
    <QCardSection class="q-pa-lg">
      <h2 class="text-headline-small">{{ type === 'add' ? '上傳外派獎金' : '編輯外派獎金' }}</h2>
    </QCardSection>
    <QCardSection class="q-pa-lg content">
      <form>
        <OSelect name="userId" label="治療師*" error-message="" :options="therapistOptions" />
        <OInput name="title" inside-label="項目名稱*" error-message="" />
        <OInput name="amount" inside-label="金額*" type="number" error-message="" />
        <OInput date-mode name="reviewDate" inside-label="上傳日期*" mask="date" :rules="['date']" error-message="" />
        <OTime name="reviewTime" now-btn label="上傳時間" error-message="" />
        <div v-if="initialValues?.attachment && values.attachment" class="preview_files">
          <OPreview
            label="附件資料"
            name="attachment"
          />
        </div>
        <template v-else>
          <p style="color: rgba(69, 70, 79, 1)" class="q-mb-md">*必填。每次限傳一張，格式須為 圖片 或 PDF，檔案大小不得超過 5MB</p>
          <OFile :model-value="newAttachment" name="attachment" label="選擇檔案" :max-file-size="5242880" accept=".jpg, .png, image/*, .pdf" @update:model-value="handleUpload" />
        </template>
      </form>
    </QCardSection>
    <QCardSection class="q-pa-lg row justify-end">
      <QBtn flat rounded label="取消" class="q-mr-sm" @click="$emit('close')" />
      <QBtn :disable="!meta.valid" rounded color="primary" label="確定" :loading="isLoading" @click="onSubmit" />
    </QCardSection>
  </QCard>
</template>

<style scoped lang="scss">
.form {
  min-width: 480px;
  :deep(.q-uploader) {
    .q-uploader__header {
      position: relative;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      background-color: transparent !important;
      color: transparent;
    }
  }
  .content {
    overflow: auto;
  }
}
</style>
