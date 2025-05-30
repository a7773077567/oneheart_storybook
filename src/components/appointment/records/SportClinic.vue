<script setup lang="ts">
// 運科諮詢
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useAppointmentStore } from '@/stores';
import {
  type ClientScheduleDetail,
  type HistoryChiefComplaint,
  type SportConsultation,
  appointmentFinishRecord,
  updateClientSchedule,
} from '@/api';
import { useForm } from 'vee-validate';
import { pick } from 'radash';
import { HistoryChiefComplaints, MedicalHistoryClipboard } from '@/components/appointment';
import { useQuasar } from 'quasar';
import { ScheduleStateMap } from '@/const/appointment';
import { useNotify } from '@/composables/notify';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const recordId = computed(
  () => props.scheduleDetail.medicalAndTrainingRecordId,
);
const appointmentStore = useAppointmentStore();
const schedule = computed(() => appointmentStore.targetClientSchedule!);
const scheduleState = computed(() => ScheduleStateMap.get(schedule.value.state)!.label);
// await appointmentStore.getHistoryChiefComplaints(recordId.value);

const date = computed(() =>
  dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'),
);
const data = [
  { name: 'chiefComplaint', label: '主訴', showCopyBtn: true },
  { name: 'coachAdvice', label: '教練建議' },
];

const stateOfHistoryDialog = ref(false);

const initialValues = computed<{
  [key in keyof SportConsultation]: SportConsultation[key];
}>(() => pick(props.scheduleDetail.record, ['chiefComplaint', 'coachAdvice']));

const { handleSubmit, meta, setValues } = useForm({
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (val) => {
  await updateClientSchedule(recordId.value, val);
  $q.notify({ message: '已存檔', timeout: 200 });

  await appointmentStore.getClientSchedule(props.scheduleId);
});
async function openHistoryDialog() {
  await appointmentStore.getHistoryRecords(recordId.value);
  stateOfHistoryDialog.value = true;
}
// function pasteHistory(history: HistoryChiefComplaint) {
//   setFieldValue('chiefComplaint', history.chiefComplaint);
//   stateOfHistoryDialog.value = false;
// }

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
  <div class="form" v-bind="$attrs">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div v-for="(item, idx) in data" :key="idx" class="input">
        <div class="input__label">
          <span>{{ item.label }}</span>
          <QBtn v-if="item.showCopyBtn" icon="o_folder" label="歷史病例" size="12px" class="cursor-pointer q-pa-xs" flat style="color: #137AB3;" @click="openHistoryDialog" />
        </div>
        <OInput
          :name="item.name"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </div>
    </div>
    <div class="form__actions">
      <QBtn label="儲存" style="width: 127px" outline :disable="!meta.dirty" @click="onSubmit" />
      <QBtn v-if="scheduleState === '完成服務'" label="病例完成" color="primary" style="width: 127px;" @click="finishRecord" />
    </div>
  </div>
  <QDialog v-model="stateOfHistoryDialog">
    <MedicalHistoryClipboard :data="appointmentStore.sportClinicHistoryRecords" @select="selectRecord" />
  </QDialog>
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
