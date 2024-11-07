<script setup lang="ts">
import { useForm } from 'vee-validate';
import { type ClientScheduleDetail, type MedicalRecord, appointmentFinishRecord, updateClientSchedule } from '@/api/appointment';
import { computed, ref } from 'vue';
import { useAppointmentStore } from '@/stores';
import { MedicalHistoryClipboard } from '@/components/appointment';
import { pick } from 'radash';
import { useQuasar } from 'quasar';
import { extractUuidFromS3Url } from '@/utils/helpers';
import dayjs from 'dayjs';
import { ScheduleStateMap } from '@/const/appointment';
import { useNotify } from '@/composables/notify';

interface DataItem {
  name: string;
  label?: string;
  showCopyBtn?: boolean;
}

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const schedule = computed(() => appointmentStore.targetClientSchedule!);
const scheduleState = computed(() => ScheduleStateMap.get(schedule.value.state)!.label);
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const stateOfHistoryDialog = ref(false);
const date = computed(() => dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'));

const data: DataItem[] = [
  { name: 'chiefComplaint', label: '主訴', showCopyBtn: true },
  { name: 'assessmentResults', label: '評估結果' },
  { name: 'treatmentPlan', label: '治療計畫' },
  { name: 'treatmentNotes', label: '治療備註' },
  { name: 'forExerciseGroup', label: '給運動組的建議' },
  { name: 'forFrontDesk', label: '給櫃檯的建議' },
];

const initialValues = computed<{ [key in keyof MedicalRecord]: MedicalRecord[key] }>(() => pick(props.scheduleDetail.record, ['chiefComplaint', 'assessmentResults', 'treatmentPlan', 'treatmentNotes', 'forExerciseGroup', 'forFrontDesk', 'attachments']));
const { handleSubmit, resetForm, values, setValues } = useForm({ initialValues: initialValues.value });
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
  useNotify('已存檔');

  await appointmentStore.getClientSchedule(props.scheduleId);
  resetForm({ values: initialValues.value });
});

async function openHistoryDialog() {
  await appointmentStore.getHistoryRecords(recordId.value);
  stateOfHistoryDialog.value = true;
}

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

function selectRecord(record: Record<string, any>) {
  setValues(record);
  stateOfHistoryDialog.value = false;
  useNotify('病例套用成功');
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
          <QBtn v-if="item.showCopyBtn" icon="o_folder" label="歷史病例" size="12px" class="cursor-pointer q-pa-xs" flat style="color: #137AB3;" @click="openHistoryDialog" />
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
      <QBtn label="儲存" outline style="width: 127px" @click="onSubmit" />
      <QBtn v-if="scheduleState === '完成服務'" label="病例完成" color="primary" style="width: 127px;" @click="finishRecord" />
    </div>
    <QDialog v-model="stateOfHistoryDialog">
      <MedicalHistoryClipboard :data="appointmentStore.medicalHistoryRecords" @select="selectRecord" />
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
    gap: 20px;
    padding: 24px 0;
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
