<script setup lang="ts">
// 運科諮詢
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useAppointmentStore } from '@/stores';
import {
  type ClientScheduleDetail,
  type HistoryChiefComplaint,
  type SportConsultation,
  updateClientSchedule,
} from '@/api';
import { useForm } from 'vee-validate';
import { pick } from 'radash';
import { HistoryChiefComplaints } from '@/components/appointment';
import { useQuasar } from 'quasar';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
  readonly: boolean;
}>();

const $q = useQuasar();
const recordId = computed(
  () => props.scheduleDetail.medicalAndTrainingRecordId,
);
const appointmentStore = useAppointmentStore();
await appointmentStore.getHistoryChiefComplaints(recordId.value);

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

const { handleSubmit, meta, setFieldValue } = useForm({
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (val) => {
  await updateClientSchedule(recordId.value, val);
  $q.notify({ message: '已存檔', timeout: 200 });

  await appointmentStore.getClientSchedule(props.scheduleId);
});

function pasteHistory(history: HistoryChiefComplaint) {
  setFieldValue('chiefComplaint', history.chiefComplaint);
  stateOfHistoryDialog.value = false;
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
          <QIcon
            v-if="item.showCopyBtn"
            name="o_folder"
            size="20px"
            class="cursor-pointer q-pa-xs"
            @click="stateOfHistoryDialog = true"
          />
        </div>
        <OInput
          :readonly="readonly"
          :name="item.name"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </div>
    </div>
    <div v-if="!readonly" class="form__actions">
      <QBtn
        label="儲存"
        style="width: 100px"
        :disable="!meta.dirty"
        @click="onSubmit"
      />
    </div>
  </div>
  <QDialog v-model="stateOfHistoryDialog">
    <HistoryChiefComplaints
      :data="appointmentStore.historyChiefComplaints"
      @choose="pasteHistory"
    />
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
