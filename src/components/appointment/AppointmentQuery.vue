<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useUserStore } from '@/stores';
import { TherapyTypes, Types } from '@/const/general';
import dayjs from 'dayjs';
import { availableReqSchema } from '@/api/appointment';

const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpace!]);
const typeOptions = Object.values(Types).map(({ label, identifier }) => ({
  label,
  value: identifier,
})).slice(-3);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(availableReqSchema),
  initialValues: {
    userShiftType: typeOptions[0].value,
    userIds: appointmentStore.users.map(user => user.id),
    date: dayjs().format('YYYY-MM-DD'),
    startTime: dayjs().startOf('day').format('HH:mm'),
    endTime: dayjs().endOf('day').format('HH:mm'),
  },
});

const onSubmit = handleSubmit(async (values) => {
  appointmentStore.availableQuery = values;
  await appointmentStore.getAvailable(appointmentStore.availableQuery);
  appointmentStore.querySent = true;
});
</script>

<template>
  <div class="booking">
    <InputBox label="選擇項目">
      <OSelect name="userShiftType" label="選擇項目" :options="typeOptions" />
    </InputBox>
    <InputBox label="選擇治療師">
      <OSelect name="userIds" label="選擇治療師" :options="appointmentStore.userOptions" multiple />
    </InputBox>
    <InputBox label="選擇日期" class="gutter">
      <DatePicker name="date" />
    </InputBox>
    <InputBox label="選擇預約時間" class="gutter">
      <OTime name="startTime" now-btn />
      <span style="translate:0 -10px;">至</span>
      <OTime name="endTime" now-btn />
      <span style="translate:0 -10px;">止</span>
    </InputBox>
    <QBtn label="搜尋" outline style="width: 126px;" @click="onSubmit" />
  </div>
</template>

<style lang="scss" scoped>

</style>
