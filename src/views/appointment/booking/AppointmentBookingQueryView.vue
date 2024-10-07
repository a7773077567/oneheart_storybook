<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { availableReqSchema } from '@/api/appointment';
import { useRouter } from 'vue-router';

const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
const shiftStore = useShiftStore();
await appointmentStore.getUsers([userStore.currentSpaceId!]);
const typeOptions = computed(() => shiftStore.spaceShiftOptions);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(availableReqSchema),
  initialValues: {
    userShiftType: typeOptions.value[0].value,
    userIds: [],
    date: dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '21:00',
  },
});

const onSubmit = handleSubmit(async (values) => {
  appointmentStore.appointmentCalendarInitOption = values.userIds!;
  appointmentStore.availableQuery = { ...values, userIds: appointmentStore.activeUsers.map(user => user.id) };
  await appointmentStore.getAvailable(appointmentStore.availableQuery);
  appointmentStore.querySent = true;
  router.push({ name: 'appointmentBookingCalendar' });
});

// function dateOptions(date: any) {
//   return date >= dayjs().format('YYYY/MM/DD');
// }
</script>

<template>
  <div class="booking-query">
    <InputBox label="選擇項目">
      <OSelect name="userShiftType" label="選擇項目" :options="typeOptions" />
    </InputBox>
    <InputBox label="選擇治療師">
      <OSelect name="userIds" label="選擇治療師" :options="appointmentStore.activeUsers" multiple />
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
.booking-query {
  width: 356px;
  padding: 20px;
}
</style>
