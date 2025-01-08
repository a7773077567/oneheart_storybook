<script setup lang='ts'>
import { computed, ref } from 'vue';
import { appointmentFinishRecord, updateClientSchedule } from '@/api/appointment';
import type { ClientScheduleDetail } from '@/api/appointment';
import { array, object, string } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore } from '@/stores';
import { useQuasar } from 'quasar';
import { ScheduleStateMap } from '@/const/appointment';
import { useNotify } from '@/composables/notify';
import { MedicalHistoryClipboard } from '@/components/appointment';

const props = defineProps<{
  title?: string;
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const appointmentStore = useAppointmentStore();

const title = computed(() => props.title ?? props.scheduleDetail.date);
const gChairSequenceOptions = ['程序一', '程序二'];
const schema = object({
  magneticGChairRecords: array(object({
    sequence: string().min(1, 'Sequence is required'),
    intensity: string().min(1, 'Intensity is required'),
  })),
});
const scheduleState = computed(() => ScheduleStateMap.get(props.scheduleDetail.state)!.label);
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);

const initVal = computed(() => {
  const ori = props.scheduleDetail.record.magneticGChairRecords;
  return {
    magneticGChairRecords: !ori || ori.length < 1
      ? [{ sequence: '', intensity: '' }]
      : ori,
  };
});
const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initVal.value,
});

const onSubmit = handleSubmit(async (v) => {
  await updateClientSchedule(recordId.value, v);
  useNotify('已存檔');

  await appointmentStore.getClientSchedule(props.scheduleId);
});

defineExpose({
  values,
});

async function finishRecord() {
  try {
    await appointmentFinishRecord(props.scheduleId);
    await appointmentStore.getClientSchedule(props.scheduleId);
    $q.notify({ message: '病例已完成', timeout: 2000, position: 'top' });
  }
  catch (err) {
    console.log(err);
  }
}

// 歷史紀錄 todo
const stateOfHistoryDialog = ref(false);
async function openHistoryDialog() {
  await appointmentStore.getHistoryRecords(recordId.value);
  stateOfHistoryDialog.value = true;
}
function selectRecord(record: Record<string, any>) {
  console.log(record);
  // 選擇紀錄寫入
  // setValues(record);
  stateOfHistoryDialog.value = false;
  useNotify('病例套用成功');
}
</script>

<template>
  <div class="gchair_record full-height">
    <div class="header">
      <slot name="top">
        <span>{{ title }}</span>
      </slot>
      <QBtn icon="o_folder" label="歷史病例" size="12px" class="cursor-pointer q-pa-xs" flat style="color: #137AB3;" @click="openHistoryDialog" />
    </div>
    <div class="body">
      <form @submit.prevent>
        <OSelect name="sequence" label="程序*" :options="gChairSequenceOptions" class="col" error-message="" />
        <OInput name="intensity" inside-label="強度*" class="col" error-message="" />
      </form>
      <div class="action">
        <QBtn v-if="scheduleState === '完成服務'" label="病例完成" color="primary" style="width: 127px;" @click="finishRecord" />
        <QBtn label="儲存" outline style="width: 127px" @click="onSubmit" />
      </div>
    </div>
  </div>
  <QDialog v-model="stateOfHistoryDialog">
    <MedicalHistoryClipboard :data="appointmentStore.medicalHistoryRecords" @select="selectRecord" />
  </QDialog>
</template>

<style scoped lang="scss">
.gchair_record {
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .body {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    form {
      padding-bottom: 32px;
    }
    .record_row {
      display: flex;
      align-items: center;
      &_idx,
      &_action {
        padding-bottom: 20px;
        max-width: fit-content;
      }
    }
    .action {
      margin-top: auto;
      display: flex;
      justify-content: end;
    }
  }
}
</style>
