<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { availableRearrangedSchema } from '@/api/appointment';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { getType } from '@/utils/mappers';

const appointmentStore = useAppointmentStore();
const router = useRouter();
const { client, userShift, date, scheduleStartTime, scheduleEndTime } = appointmentStore.targetClientScheduleNotStarted!;
const infoData = new Map([
  ['姓名', () => client.name],
  ['電話', () => client.phone],
  ['科別', () => getType(userShift.type)],
  ['治療師', () => userShift.user.name],
  ['原預約日期', () => date],
  ['原預約時間', () => `${scheduleStartTime}-${scheduleEndTime}`],
]);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(availableRearrangedSchema),
  initialValues: {
    clientScheduleId: appointmentStore.targetClientScheduleNotStarted!.id,
    date: dayjs().format('YYYY-MM-DD'),
    startTime: dayjs().startOf('day').format('HH:mm'),
    endTime: dayjs().endOf('day').format('HH:mm'),
  },
});

const onSubmit = handleSubmit(async (values) => {
  await appointmentStore.getAvailableRearranged(values);
  appointmentStore.rearrangeQuery = values;
  appointmentStore.querySent = true;
  appointmentStore.rearrangeMode = true;
  router.push({ name: 'appointmentBooking' });
});
</script>

<template>
  <div class="rearrange">
    <div class="rearrange__header">
      <div class="info">
        <div
          v-for="([key, getter], idx) in infoData.entries()"
          :key="idx"
          class="info__item"
        >
          {{ key }}：{{ getter() }}
        </div>
      </div>
    </div>
    <div class="rearrange__body">
      <InputBox label="選擇日期" label-weight="400">
        <DatePicker name="date" />
      </InputBox>
      <InputBox label="選擇時間區間" label-weight="400" style="width: 472px;">
        <OTime name="startTime" now-btn />
        <span style="translate:0 -10px;">至</span>
        <OTime name="endTime" now-btn />
        <span style="translate:0 -10px;">止</span>
      </InputBox>
      <QBtn label="搜尋" style="width: 126px;height: 40px" outline @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rearrange {
  padding: 20px;
  &__header {
    margin-bottom: 20px;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.info {
  width: fit-content;
  padding: 20px 66px 20px 0;
  display: grid;
  grid-template-columns: repeat(2, auto);
  column-gap: 36px;
  row-gap: 5px;
  border-top: 2px solid #79747e;
  border-bottom: 2px solid #79747e;
  &__item {
    font-size: 16px;
    color: #49454f;
  }
}
</style>
