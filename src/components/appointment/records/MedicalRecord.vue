<script setup lang="ts">
import { useForm } from 'vee-validate';
import { type ClientScheduleDetail, type HistoryChiefComplaint, type MedicalRecord, updateClientSchedule } from '@/api/appointment';
import { computed, ref } from 'vue';
import { useAppointmentStore } from '@/stores';
import { HistoryChiefComplaints } from '@/components/appointment';
import { pick } from 'radash';
import { useQuasar } from 'quasar';
import { extractUuidFromS3Url } from '@/utils/helpers';
import dayjs from 'dayjs';

interface DataItem {
  name: string;
  label?: string;
  showCopyBtn?: boolean;
}

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const appointmentStore = useAppointmentStore();
const $q = useQuasar();
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const stateOfHistoryDialog = ref(false);
const date = computed(() => dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'));
await appointmentStore.getHistoryChiefComplaints(recordId.value);

const data: DataItem[] = [
  { name: 'chiefComplaint', label: '主訴', showCopyBtn: true },
  { name: 'assessmentResults', label: '評估結果' },
  { name: 'treatmentPlan', label: '治療計畫' },
  { name: 'treatmentNotes', label: '治療備註' },
  { name: 'forExerciseGroup', label: '給運動組的建議' },
  { name: 'forFrontDesk', label: '給櫃檯的建議' },
];

const initialValues = computed(() => pick(props.scheduleDetail.record, ['chiefComplaint', 'assessmentResults', 'treatmentPlan', 'treatmentNotes', 'forExerciseGroup', 'forFrontDesk', 'attachments']));
const { handleSubmit, resetForm, setFieldValue, values } = useForm({ initialValues: initialValues.value });
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

function openHistoryDialog() {
  stateOfHistoryDialog.value = true;
}

function pasteHistory(history: HistoryChiefComplaint) {
  setFieldValue('chiefComplaint', history.chiefComplaint);
  stateOfHistoryDialog.value = false;
}
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div v-for="(item, idx) in data" :key="idx" class="input">
        <div class="input__label">
          <span>{{ item.label }}</span>
          <QIcon v-if="item.showCopyBtn" name="o_folder" size="20px" class="cursor-pointer q-pa-xs" @click="openHistoryDialog" />
        </div>
        <OInput :name="item.name" type="textarea" class="input__item" hide-bottom-space />
      </div>
      <OFile v-model="newAttachment" label="選擇檔案" multiple />
      <div class="preview_files">
        <OPreview
          v-for="(attachment, idx) in displayAttachments" :key="attachment.name"
          :name="attachment.name"
          :label="`附件資料 ${idx + 1}`"
        />
      </div>
    </div>
    <div class="form__actions">
      <QIcon name="o_save" size="24px" class="cursor-pointer q-pa-xs" @click="onSubmit" />
      <QBtn label="完成服務" outline style="width: 126px;height: 40px;" />
    </div>
    <QDialog v-model="stateOfHistoryDialog">
      <HistoryChiefComplaints :data="appointmentStore.historyChiefComplaints" @choose="pasteHistory" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  &__body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
  }
}

.input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 14px;
  }
}

:deep(textarea) {
  height: 50px;
}
</style>
