<script setup lang="ts">
import { computed } from 'vue';
import { AppointmentQueryItem } from '@/components/appointment';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useShiftStore } from '@/stores';
import { type ClientSchedule, ClientSchedulesNotStartedSchema, cancelClientScheduleNotStarted } from '@/api/appointment';
import dayjs from 'dayjs';
import { removeNullishKeys } from '@/utils/helpers';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const shiftStore = useShiftStore();
const typeOptions = computed(() => shiftStore.spaceShiftOptions);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(ClientSchedulesNotStartedSchema),
  initialValues: {
    phone: '',
    name: '',
    userShiftTypes: typeOptions.value.map(option => option.value),
    date: dayjs().format('YYYY-MM-DD'),
  },
});

const onSubmit = handleSubmit((values) => {
  const payload = removeNullishKeys(values);
  appointmentStore.clientSchedulesNotStartedQuery = payload;
  appointmentStore.getClientSchedulesNotStarted(payload);
});

function cancelClientSchedule(clientScheduleId: number) {
  $q.dialog({
    message: '是否確定要取消預約？',
  }).onOk(async () => {
    await cancelClientScheduleNotStarted(clientScheduleId);
    await appointmentStore.getClientSchedulesNotStarted(appointmentStore.clientSchedulesNotStartedQuery!);
  });
}

function rearrangeClientSchedule(clientSchedule: ClientSchedule) {
  appointmentStore.targetClientScheduleNotStarted = clientSchedule;
  router.push({ name: 'appointmentCurrentQueryRearrange' });
}
</script>

<template>
  <div class="query">
    <div class="query__header">
      <div class="nav">
        <div class="nav__item">
          <span>客戶電話</span>
          <OInput class="nav__input" name="phone" hide-bottom-space />
        </div>
        <div class="nav__item">
          <span>客戶姓名</span>
          <OInput class="nav__input" name="name" hide-bottom-space />
        </div>
        <p class="nav__item--end">
          客戶電話與姓名可不填
        </p>
        <div class="nav__item">
          <span>選擇項目</span>
          <OSelect :options="typeOptions" class="nav__input" name="userShiftTypes" hide-bottom-space multiple map-options outlined style="width: 164px;" />
        </div>
        <div class="nav__item">
          <span>預約日期</span>
          <OInput class="nav__input" name="date" hide-bottom-space date-mode />
        </div>
        <div class="nav__item--end">
          <QBtn label="查詢預約" style="width: 126px;height: 40px;" outline @click="onSubmit" />
          <QBtn label="清除" style="width: 80px;height: 40px;" outline @click="appointmentStore.resetClientSchedulesNotStartedState" />
        </div>
      </div>
    </div>
    <div class="query__body">
      <AppointmentQueryItem
        v-for="(item, idx) in appointmentStore.clientSchedulesNotStarted"
        :key="idx"
        :data="item"
        @cancel="cancelClientSchedule"
        @rearrange="rearrangeClientSchedule"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.query {
  &__body {
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
.nav {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 281px) auto;
  align-items: center;
  column-gap: 24px;
  row-gap: 20px;
  padding: 10px;
  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    &--end {
      @extend .nav__item;
      justify-self: end;
      padding-left: 30px;
    }
  }
  &__input {
    flex: 1 1 auto;
  }
}

:deep(.q-field__native > span) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
