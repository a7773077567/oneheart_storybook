<script setup lang="ts">
// 團課單
import { computed } from 'vue';
import dayjs from 'dayjs';
import { type ClientScheduleDetail, appointmentFinishRecord, updateClientSchedule } from '@/api';
import { useForm } from 'vee-validate';
import { useAppointmentStore } from '@/stores';
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
const recordId = computed(
  () => props.scheduleDetail.medicalAndTrainingRecordId,
);

const date = computed(() =>
  dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'),
);

const initialValues = computed(() => {
  return { note: props.scheduleDetail.record.note };
});
const { handleSubmit, meta } = useForm({
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (val) => {
  await updateClientSchedule(recordId.value, val);
  $q.notify({ message: '已存檔', timeout: 2000 });

  await appointmentStore.getClientSchedule(props.scheduleId);
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
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div class="input">
        <div class="input__label">
          <span>備註</span>
        </div>
        <OInput
          name="note"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </div>
    </div>
    <div class="flex column  items-end q-gutter-md">
      <QBtn
        label="儲存"
        style="width: 127px"
        outline
        :disable="!meta.dirty"
        @click="onSubmit"
      />
      <QBtn v-if="scheduleState === '完成服務'" 病例完成 color="primary" style="width: 127px;" @click="finishRecord" />
    </div>
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
