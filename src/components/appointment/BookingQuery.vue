<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { bookingInitialValues, bookingSchema } from '@/api/appointment';
import { useAppointmentStore } from '@/stores';
import { storeToRefs } from 'pinia';

const appointmentStore = useAppointmentStore();
const { therapyTypeOptions, therapistOptions } = storeToRefs(appointmentStore);
const { getTherapyTypes, getTherapists } = appointmentStore;

getTherapyTypes();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: bookingInitialValues,
});

const onSubmit = handleSubmit((values) => {
  appointmentStore.booking = values;
});
</script>

<template>
  <div class="booking">
    <InputBox label="選擇項目">
      <OSelect name="therapyType" label="選擇項目" :options="therapyTypeOptions" @update:model-value="getTherapists" />
    </InputBox>
    <InputBox label="選擇治療師">
      <OSelect name="therapist" label="選擇治療師" :options="therapistOptions" />
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
