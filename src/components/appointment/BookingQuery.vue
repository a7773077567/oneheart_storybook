<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useUserStore } from '@/stores';
import { TherapyTypes } from '@/const/general';
import dayjs from 'dayjs';
import { bookingSchema } from '@/api/appointment';

const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await appointmentStore.getUsers([userStore.currentSpace!]);
const typeOptions = Object.values(TherapyTypes).map((item, idx) => ({
  label: item,
  value: idx + 1,
}));

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    therapyType: typeOptions[0].value,
    date: dayjs().format('YYYY-MM-DD'),
  },
});

const onSubmit = handleSubmit((values) => {
  appointmentStore.bookingQuery = values;
  appointmentStore.querySent = true;
});
</script>

<template>
  <div class="booking">
    <InputBox label="選擇項目">
      <OSelect name="therapyType" label="選擇項目" :options="typeOptions" />
      <!-- @update:model-value="getTherapists" -->
    </InputBox>
    <InputBox label="選擇治療師">
      <OSelect name="therapist" label="選擇治療師" :options="appointmentStore.userOptions" />
    </InputBox>
    <InputBox label="選擇日期" class="gutter">
      <DatePicker name="date" />
    </InputBox>
    <InputBox label="選擇預約時間" class="gutter">
      <OTime name="startTime" now-btn />
      <span>至</span>
      <OTime name="endTime" now-btn />
      <span>止</span>
    </InputBox>
    <QBtn label="搜尋" outline style="width: 126px;" @click="onSubmit" />
  </div>
</template>

<style lang="scss" scoped>

</style>
