<script setup lang='ts'>
import { computed, ref } from 'vue';
import { appointmentFinishRecord, updateClientSchedule } from '@/api/appointment';
import type { ClientScheduleDetail, MagneticWavesRecord } from '@/api/appointment';
import { array, object, string } from 'zod';
import { useFieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore } from '@/stores';
import { useQuasar } from 'quasar';
import { ScheduleStateMap } from '@/const/appointment';
import { MedicalHistoryClipboard } from '@/components/appointment';
import { useNotify } from '@/composables/notify';
import { AddOnServiceTypes } from '@/const/general';

const props = defineProps<{
  title?: string;
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const appointmentStore = useAppointmentStore();

const title = computed(() => props.title ?? props.scheduleDetail.date);
const isAddOnRecord = computed(() => !!props.scheduleDetail.addOnServices.find(service => service.serviceType === AddOnServiceTypes['磁波'])?.isAddOn);

const schema = object({
  magneticWavesRecords: array(object({
    sequence: string().min(1, 'Sequence is required'),
    bodyPart: string().min(1, 'Body part is required'),
    intensity: string().min(1, 'Intensity is required'),
  }))
  ,
});
const scheduleState = computed(() => ScheduleStateMap.get(props.scheduleDetail.state)!.label);
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const singleRecord = {
  sequence: '',
  bodyPart: '',
  intensity: '',
};
const initVal = computed(() => {
  const ori = props.scheduleDetail.record.magneticWavesRecords;
  return ({ magneticWavesRecords: !ori || ori?.length < 1
    ? [singleRecord]
    : ori });
});
const { handleSubmit, values, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initVal.value,
});

const { fields, push, remove } = useFieldArray<MagneticWavesRecord>('magneticWavesRecords');

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
  if (isAddOnRecord.value) {
    await appointmentStore.getAddOnHistoryRecords({ recordId: recordId.value, serviceType: AddOnServiceTypes['磁波'] });
  }
  else {
    await appointmentStore.getHistoryRecords(recordId.value);
  }
  stateOfHistoryDialog.value = true;
}
function selectRecord(record: Record<string, any>) {
  setValues(record);
  stateOfHistoryDialog.value = false;
  useNotify('病例套用成功');
}
</script>

<template>
  <div class="magnetic_wave_record full-height">
    <div class="header">
      <slot name="top">
        <span>{{ title }}</span>
      </slot>
      <QBtn icon="o_folder" label="歷史病例" size="12px" class="cursor-pointer q-pa-xs" flat style="color: #137AB3;" @click="openHistoryDialog" />
    </div>
    <div class="body">
      <form @submit.prevent>
        <div v-for="(item, index) in fields" :key="index" class="record_row row q-col-gutter-md">
          <div class="record_row_idx col">{{ index + 1 }}</div>
          <OInput :name="`magneticWavesRecords[${index}].sequence`" inside-label="程序*" class="col" error-message="" />
          <OInput :name="`magneticWavesRecords[${index}].bodyPart`" inside-label="部位*" class="col" error-message="" />
          <OInput :name="`magneticWavesRecords[${index}].intensity`" inside-label="強度*" class="col" error-message="" />
          <div class="record_row_action col">
            <QBtn
              :disable="index === 0"
              :color="index === 0 ? 'grey' : 'black'"
              flat
              round
              icon="o_delete"
              @click="remove(index)"
            />
          </div>
        </div>
        <QBtn
          flat
          icon="add"
          label="新增一列訓練記錄"
          color="blue"
          @click="push(singleRecord)"
        />
      </form>
      <div class="action">
        <QBtn v-if="scheduleState === '完成服務'" label="病例完成" color="primary" style="width: 127px;" @click="finishRecord" />
        <QBtn label="儲存" outline style="width: 127px" @click="onSubmit" />
      </div>
    </div>
  </div>
  <QDialog v-model="stateOfHistoryDialog">
    <MedicalHistoryClipboard :data="appointmentStore.magneticWaveHistoryRecords" expand-all @select="selectRecord">
      <template #record-content="{ value }">
        <QList separator>
          <QItem v-for="(recordItem, idx) in value" :key="idx">
            <QItemSection>
              <QItemLabel class="history_record">
                <span class="history_record_label">程序</span>
                <span class="history_record_val">{{ recordItem.sequence }}</span>
              </QItemLabel>
            </QItemSection>
            <QItemSection>
              <QItemLabel class="history_record">
                <span class="history_record_label">部位</span>
                <span class="history_record_val">{{ recordItem.bodyPart }}</span>
              </QItemLabel>
            </QItemSection>
            <QItemSection>
              <QItemLabel class="history_record">
                <span class="history_record_label">強度</span>
                <span class="history_record_val">{{ recordItem.intensity }}</span>
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </template>
    </MedicalHistoryClipboard>
  </QDialog>
</template>

<style scoped lang="scss">
.magnetic_wave_record {
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

<style lang="scss">
.medical-history-clipboard .history_record {
  &_label {
    color: #45464f;
    font-size: 14px;
    font-weight: 500;
    margin-right: 16px;
  }
  &_val {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
