<script setup lang="ts">
import { useForm } from 'vee-validate';
import { HistoryChiefComplaints, MedicalHistoryClipboard } from '@/components/appointment';
import { type ClientScheduleDetail, type HistoryChiefComplaint, type PhysicalConsultation, appointmentFinishRecord, updateClientSchedule } from '@/api/appointment';
import { computed, ref } from 'vue';
import { useAppointmentStore } from '@/stores';
import { pick } from 'radash';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { ScheduleStateMap } from '@/const/appointment';
import { useNotify } from '@/composables/notify';

interface DataItem {
  title: string;
  items: {
    name: string;
    label: string;
    showCopyBtn?: boolean;
  }[];
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

const initialValues = computed(() => pick(props.scheduleDetail.record, ['chiefComplaint', 'pastHistory', 'occupationType', 'exerciseHabits', 'others', 'clinicalObservation', 'palpation', 'movementAssessment', 'problemSummary', 'treatmentNotes', 'forExerciseGroup']));
const { handleSubmit, setValues, resetForm } = useForm({ initialValues: initialValues.value });
const onSubmit = handleSubmit(async (formValue) => {
  await updateClientSchedule(recordId.value, formValue);
  $q.notify({ message: '已存檔', timeout: 2000 });

  await appointmentStore.getClientSchedule(props.scheduleId);
  resetForm({ values: initialValues.value });
});

const data: DataItem[] = [
  {
    title: '基本資料',
    items: [{ name: 'chiefComplaint', label: '主訴', showCopyBtn: true }, { name: 'pastHistory', label: '病史' }, { name: 'occupationType', label: '職業類型/生活型態' }, { name: 'exerciseHabits', label: '運動習慣' }, { name: 'others', label: '其他' }],
  },
  {
    title: '理學檢查',
    items: [{ name: 'clinicalObservation', label: '臨床觀察' }, { name: 'palpation', label: '觸診' }, { name: 'movementAssessment', label: '動作測試' }],
  },
  {
    title: '評估',
    items: [{ name: 'problemSummary', label: '問題總結' }],
  },
  {
    title: '治療計畫',
    items: [{ name: 'treatmentNotes', label: '治療備註' }],
  },
  {
    title: '建議',
    items: [{ name: 'forExerciseGroup', label: '給運動組的建議' }],
  },

];

async function openHistoryDialog() {
  await appointmentStore.getHistoryRecords(recordId.value);
  stateOfHistoryDialog.value = true;
}

function selectRecord(record: Record<string, any>) {
  setValues(record);
  stateOfHistoryDialog.value = false;
  useNotify('病例套用成功');
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
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div v-for="({ items, title }, idx) in data" :key="idx" class="group">
        <p class="group__title">
          {{ title }}
        </p>
        <div class="group__body">
          <div v-for="(item, itemIdx) in items" :key="itemIdx" class="input">
            <div class="input__label">
              <span>{{ item.label }}</span>
              <QBtn v-if="item.showCopyBtn" icon="o_folder" label="歷史病例" size="12px" class="cursor-pointer q-pa-xs" flat style="color: #137AB3;" @click="openHistoryDialog" />
            </div>
            <OInput :name="item.name" type="textarea" class="input__item" hide-bottom-space />
          </div>
        </div>
      </div>
    </div>
    <div class="form__actions">
      <QBtn label="儲存" style="width: 100px" @click="onSubmit" />
      <QBtn v-if="scheduleState === '完成服務'" label="病例完成" color="primary" style="width: 127px;" @click="finishRecord" />
    </div>
    <QDialog v-model="stateOfHistoryDialog">
      <MedicalHistoryClipboard :data="appointmentStore.physicalConsultationHistoryRecords" @select="selectRecord" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 24px 0;
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

.group {
  &__title {
    padding: 15px 0 5px 0;
    border-bottom: 3px solid #79747e;
    margin-bottom: 15px;
    font-weight: 500;
  }
  &__body {
    display: flex;
    flex-direction: column;
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
