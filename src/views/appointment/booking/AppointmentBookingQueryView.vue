<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { availableReqSchema } from '@/api/appointment';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getType } from '@/utils/mappers';

const $q = useQuasar();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
const shiftStore = useShiftStore();
const selectLabel = ref('治療師');
const therapistOptions = ref<any[]>([]);
await appointmentStore.getUsers([userStore.currentSpaceId!]);

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: toTypedSchema(availableReqSchema),
  initialValues: {
    userShiftType: shiftStore.spaceShiftOptions[0].value,
    userIds: [],
    date: dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '21:00',
  },
});

watch(() => values.userShiftType, (newShiftType) => {
  const shiftDetails = getType(newShiftType!)!;
  const newTherapistOptions = appointmentStore.activeUsers.filter(item => shiftDetails.roles.includes(item.role.type));
  const newTherapistIds = newTherapistOptions.map(item => item.id);
  therapistOptions.value = newTherapistOptions;
  setFieldValue('userIds', newTherapistIds);
  selectLabel.value = shiftDetails.selectLabel;
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  appointmentStore.appointmentCalendarInitOption = values.userIds!;
  appointmentStore.availableQuery = { ...values, userIds: appointmentStore.activeUsers.map(user => user.id) };

  try {
    $q.loading.show();
    await appointmentStore.getAvailable(appointmentStore.availableQuery);
    appointmentStore.querySent = true;
    await router.push({ name: 'appointmentBookingCalendar' });
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
});

// function dateOptions(date: any) {
//   return date >= dayjs().format('YYYY/MM/DD');
// }
</script>

<template>
  <div class="booking-query">
    <InputBox label="選擇項目">
      <OSelect name="userShiftType" label="選擇項目" :options="shiftStore.spaceShiftOptions" />
    </InputBox>
    <InputBox :label="`選擇${selectLabel}`">
      <OSelect :emit-value="false" name="userIds" :label="`選擇${selectLabel}`" :options="therapistOptions" multiple />
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
