<script setup lang="ts">
// 運動訓練單
import { computed } from 'vue';
import dayjs from 'dayjs';
import { pick } from 'radash';
import { type ClientScheduleDetail, type Record, type TrainingPlan, updateClientSchedule } from '@/api';
import { useForm } from 'vee-validate';
import { useAppointmentStore } from '@/stores';
import { useQuasar } from 'quasar';
import { array, object, string } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
  readonly: boolean;
}>();

const appointmentStore = useAppointmentStore();
const $q = useQuasar();

const recordId = computed(
  () => props.scheduleDetail.medicalAndTrainingRecordId,
);
const date = computed(() =>
  dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'),
);
const recordField = [
  { name: 'exercise', label: '動作' },
  { name: 'weight', label: '重量' },
  { name: 'reps', label: '次數' },
  { name: 'intensity_Sets', label: '組數/強度' },
  { name: 'notes', label: '備註' },
  { name: 'del', label: '' },
];
const trainingPlanFields = [
  { name: 'forMedicalGroup', label: '給治療組的建議' },
  { name: 'forFrontDesk', label: '給櫃檯的建議' },
  { name: 'forClient', label: '給客戶的建議' },
];

const initialValues = computed<{
  [key in keyof TrainingPlan]: TrainingPlan[key];
}>(() => {
  return pick(props.scheduleDetail.record, [
    'trainingRecords',
    'forMedicalGroup',
    'forFrontDesk',
    'forClient',
  ]);
});

const schema = object({
  trainingRecords: array(object({
    exercise: string().min(1),
    weight: string().min(1),
    reps: string().min(1),
    intensity_Sets: string().min(1),
    notes: string().min(1),
  }).required()),
}).required();

const oneRecord = { exercise: '', weight: '', reps: '', intensity_Sets: '', notes: '' };
const { handleSubmit, setFieldValue, values, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    ...initialValues.value,
    ...((initialValues.value.trainingRecords?.length ?? 0) >= 1
      ? initialValues.value.trainingRecords
      : { trainingRecords: [oneRecord, oneRecord] }),
  },
});

const onSubmit = handleSubmit(async (formValue) => {
  const { trainingRecords, ...otherFields } = formValue;
  await updateClientSchedule(recordId.value, { ...otherFields, trainingRecords: trainingRecords.filter(record => Object.keys(record).length > 0) } as Partial<Record>);
  $q.notify({ message: '已存檔', timeout: 200 });

  await appointmentStore.getClientSchedule(props.scheduleId);
});

function addNewSet() {
  setFieldValue('trainingRecords', [...(values.trainingRecords ?? [oneRecord]), oneRecord]);
}

function deleteSet(delIdx: number) {
  const newRecords = values.trainingRecords?.filter((_, idx) => idx !== delIdx);
  setFieldValue('trainingRecords', newRecords);
}
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <fieldset class="records">
        <div
          v-for="oneSet in recordField"
          :key="oneSet.label"
          class="records__label"
        >
          {{ oneSet.label }}
        </div>
        <template
          v-for="(record, recordIdx) in values.trainingRecords"
          :key="recordIdx"
        >
          <div
            v-for="(oneSet, idx) in recordField"
            :key="idx"
            class="records__val"
          >
            <div v-if="oneSet.name === 'del'">
              <QBtn
                v-if="!readonly"
                flat
                round
                icon="delete"
                @click="deleteSet(recordIdx)"
              />
            </div>
            <OInput
              v-else
              :readonly="readonly"
              :name="`trainingRecords[${recordIdx}].${oneSet.name}`"
              class="records__item"
              hide-bottom-space
            />
          </div>
        </template>
      </fieldset>
      <div v-if="!readonly">
        <QBtn flat label="新增下一列" icon="o_add" @click="addNewSet" />
      </div>
      <fieldset
        v-for="(item, idx) in trainingPlanFields"
        :key="idx"
        class="input"
      >
        <div class="input__label">
          <span>{{ item.label }}</span>
        </div>
        <OInput
          :readonly="readonly"
          :name="item.name"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </fieldset>
    </div>
    <div v-if="!readonly" class="form__actions">
      <QBtn
        label="儲存"
        style="width: 100px"
        :disable="!meta.dirty || !meta.valid"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 12px 0;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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

.records {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 50px;
  gap: 12px;
  &__label {
    text-align: center;
  }
}
</style>
