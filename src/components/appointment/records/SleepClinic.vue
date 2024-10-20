<script setup lang="ts">
import { computed, ref } from 'vue';
import { appointmentFinishRecord, updateClientSchedule } from '@/api';
import type { ClientScheduleDetail, Sleep } from '@/api';
import { useForm } from 'vee-validate';
import { useAppointmentStore } from '@/stores';
import { extractUuidFromS3Url } from '@/utils/helpers';
import { useQuasar } from 'quasar';
import { ScheduleStateMap } from '@/const/appointment';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const schedule = computed(() => appointmentStore.targetClientSchedule!);
const scheduleState = computed(() => ScheduleStateMap.get(schedule.value.state)!.label);

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
  $q.notify({ message: '已存檔', timeout: 2000 });

  await appointmentStore.getClientSchedule(props.scheduleId);
  resetForm({ values: initialValues.value });
});

async function finishRecord() {
  try {
    await appointmentFinishRecord(schedule.value.id);
    await appointmentStore.getClientSchedule(schedule.value.id);
    $q.notify({ message: '病例已完成', timeout: 2000, position: 'top' });
  }
  catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div class="sleep_form">
    <p class="sleep_form_header">
      {{ scheduleDetail.date }}
    </p>
    <form class="sleep_form_body">
      <fieldset>
        <legend>客戶問題描述</legend>
        <OInput name="customerProblemDescription" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>評估狀態</legend>
        <OInput name="assessmentStatus" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>產品描述</legend>
        <OInput name="productDescription" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>備註</legend>
        <OInput name="note" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <OFile v-model="newAttachment" multiple label="選擇檔案" />
        <div class="preview_files">
          <OPreview
            v-for="(attachment, idx) in displayAttachments" :key="attachment.name"
            :name="attachment.name"
            :label="`附件資料 ${idx + 1}`"
          />
        </div>
      </fieldset>
    </form>
    <div class="sleep_form_action">
      <QBtn label="儲存" style="width: 127px" @click="onSubmit" />
      <QBtn v-if="scheduleState === '完成服務'" 病例完成 color="primary" style="width: 127px;" @click="finishRecord" />
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
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
  }
}
</style>
