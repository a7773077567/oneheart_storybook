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
import { MachineTypes, ShiftType } from '@/const/general';

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
  // const newTherapistIds = newTherapistOptions.map(item => item.id);
  therapistOptions.value = newTherapistOptions;
  setFieldValue('userIds', []);
  selectLabel.value = shiftDetails.selectLabel;
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  appointmentStore.appointmentCalendarInitOption = values.userIds!;
  appointmentStore.availableQuery = { ...values, userIds: appointmentStore.activeUsers.map(user => user.id) };

  try {
    $q.loading.show();
    await appointmentStore.getAvailable(appointmentStore.availableQuery);
    appointmentStore.querySent = true;

    // G動椅是另外的 Machine Calendar 顯示
    await router.push(values.userShiftType === ShiftType['G動椅']
      ? {
          name: 'machineBookingCalendar',
          params: {
            machineType: MachineTypes['G動椅儀器治療'],
          },
        }
      : {
          name: 'appointmentBookingCalendar',
        });
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
      <OSelect name="userShiftType" label="選擇項目" :options="shiftStore.spaceShiftOptions" hide-bottom-space />
    </InputBox>
    <InputBox :label="`選擇${selectLabel}`">
      <OSelect
        :disable="values.userShiftType === ShiftType['G動椅']" name="userIds" :label="`選擇${selectLabel}`"
        :options="therapistOptions" multiple hide-bottom-space
      />
    </InputBox>
    <p v-if="values.userShiftType === ShiftType['G動椅']" class="note">此項目不需提前指定治療師，當天現場於「客戶預約單」指定。</p>
    <InputBox label="選擇日期" class="gutter">
      <DatePicker name="date" hide-bottom-space />
    </InputBox>
    <InputBox label="選擇預約時間" class="gutter">
      <OTime name="startTime" now-btn hide-bottom-space />
      <span style="translate:0 -10px;">至</span>
      <OTime name="endTime" now-btn hide-bottom-space />
      <span style="translate:0 -10px;">止</span>
    </InputBox>
    <QBtn label="搜尋" outline style="width: 126px;" @click="onSubmit" />
  </div>
</template>

<style lang="scss" scoped>
.booking-query {
  min-width: 356px;
  width: fit-content;
  padding: 20px;

  .note {
    font-size: 12px;
    font-weight: 500;
    color: #1a1b21;
    white-space: nowrap;
    margin-top: -8px;
    margin-bottom: 16px;
    padding-left: 16px;
  }

  .input-box {
    margin-bottom: 20px;
  }
}
</style>
