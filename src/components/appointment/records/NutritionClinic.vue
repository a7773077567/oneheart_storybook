<script setup lang="ts">
import { updateClientSchedule } from '@/api';
import type { ClientScheduleDetail, Nutrition } from '@/api';
import { useAppointmentStore } from '@/stores';
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { extractUuidFromS3Url } from '@/utils/helpers';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const appointmentStore = useAppointmentStore();
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const initialValues = computed(() => ({
  personalHealthStatus: props.scheduleDetail.record.personalHealthStatus,
  nutritionistAdvice: props.scheduleDetail.record.nutritionistAdvice,
  attachments: props.scheduleDetail.record.attachments,
}));

const { handleSubmit, values } = useForm({ initialValues: initialValues.value });
const displayAttachments = computed(() => values.attachments.filter(a => !!a));

const newAttachment = ref([]);

const onSubmit = handleSubmit(async (formValue) => {
  let fileUUIDs: string[] = [];
  if (newAttachment.value.length > 0) {
    fileUUIDs = await Promise.all(newAttachment.value.map(file =>
      appointmentStore.uploadAttachments(recordId.value, file),
    ));
  }

  await updateClientSchedule(recordId.value, { ...formValue, attachments: [...formValue.attachments, ...fileUUIDs].map(s3Url => extractUuidFromS3Url(s3Url)).filter(file => file) as string[] });
  emit('save');
});
</script>

<template>
  <div class="nutrition_form">
    <p class="nutrition_form_header">
      {{ scheduleDetail.date }}
    </p>
    <form class="nutrition_form_body">
      <fieldset>
        <legend>個人健康狀況</legend>
        <OInput name="personalHealthStatus" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>營養師建議</legend>
        <OInput name="nutritionistAdvice" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <OFile v-model="newAttachment" multiple label="選擇檔案" />
        <div class="preview_files">
          <OPreview
            v-for="(attachment, idx) in displayAttachments" :key="attachment"
            :name="`attachments[${idx}]`"
            :label="`附件資料 ${idx + 1}`"
          />
        </div>
      </fieldset>
    </form>
    <div class="nutrition_form_action">
      <QIcon name="o_save" size="24px" class="cursor-pointer q-pa-xs" @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nutrition_form {
  &_header {
    margin-bottom: 16px;
    font-size: 14px;
  }
  &_body {
    .preview_files {
      > .o_preview + .o_preview {
        margin-top: 12px;
      }
    }
  }
  form > fieldset {
    legend {
      margin-bottom: 4px;
      font-size: 14px;
    }

    & + fieldset {
      margin-top: 16px;
    }
  }

  &_action {
    display: flex;
    justify-content: right;
  }
}
</style>
