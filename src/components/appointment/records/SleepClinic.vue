<script setup lang="ts">
import { computed, ref } from 'vue';
import { updateClientSchedule } from '@/api';
import type { ClientScheduleDetail, Sleep } from '@/api';
import { useForm } from 'vee-validate';
import { useAppointmentStore } from '@/stores';
import { extractUuidFromS3Url } from '@/utils/helpers';
import { useQuasar } from 'quasar';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
  readonly: boolean;
}>();

const appointmentStore = useAppointmentStore();
const $q = useQuasar();

const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const initialValues = computed<{ [key in keyof Sleep]: Sleep[key] }>(() => {
  const { customerProblemDescription, assessmentStatus, productDescription, note, attachments } = props.scheduleDetail.record;
  return ({
    customerProblemDescription,
    assessmentStatus,
    productDescription,
    note,
    attachments,
  });
});

const { handleSubmit, values, resetForm } = useForm({ initialValues: initialValues.value });
const displayAttachments = computed(() => values.attachments?.map((attUrl, idx) => ({ name: `attachments[${idx}]`, url: attUrl }))?.filter(file => !!file.url));

const newAttachment = ref([]);
const onSubmit = handleSubmit(async (formValue) => {
  let fileUUIDs: string[] = [];
  if (newAttachment.value.length > 0) {
    fileUUIDs = await Promise.all(newAttachment.value.map(file =>
      appointmentStore.uploadAttachments(recordId.value, file),
    ));
  }

  await updateClientSchedule(recordId.value, { ...formValue, attachments: [...formValue.attachments ?? [], ...fileUUIDs].map(s3Url => extractUuidFromS3Url(s3Url)).filter(file => file) as string[] });
  $q.notify({ message: '已存檔', timeout: 200 });

  await appointmentStore.getClientSchedule(props.scheduleId);
  resetForm({ values: initialValues.value });
});
</script>

<template>
  <div class="sleep_form">
    <p class="sleep_form_header">
      {{ scheduleDetail.date }}
    </p>
    <form class="sleep_form_body">
      <fieldset>
        <legend>客戶問題描述</legend>
        <OInput :readonly="readonly" name="customerProblemDescription" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>評估狀態</legend>
        <OInput :readonly="readonly" name="assessmentStatus" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>產品描述</legend>
        <OInput :readonly="readonly" name="productDescription" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>備註</legend>
        <OInput :readonly="readonly" name="note" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <OFile v-if="!readonly" v-model="newAttachment" multiple label="選擇檔案" />
        <div class="preview_files">
          <OPreview
            v-for="(attachment, idx) in displayAttachments" :key="attachment.name"
            :name="attachment.name"
            :label="`附件資料 ${idx + 1}`"
          />
        </div>
      </fieldset>
    </form>
    <div v-if="!readonly" class="sleep_form_action">
      <QBtn label="儲存" style="width: 100px" @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sleep_form {
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
