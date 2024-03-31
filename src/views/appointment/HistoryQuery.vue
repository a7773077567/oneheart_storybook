<script setup lang="ts">
import { clientSchedulesHistoriesSchema, restoreClientSchedule } from '@/api/appointment';
import { Types } from '@/const/general';
import { useAppointmentStore } from '@/stores';
import { toTypedSchema } from '@vee-validate/zod';
import dayjs from 'dayjs';
import { useForm } from 'vee-validate';
import { AppointmentQueryItem } from '@/components/appointment';
import { removeNullishKeys } from '@/utils/helpers';

const appointmentStore = useAppointmentStore();
const typeOptions = Object.values(Types).map(type => ({
  label: type.label,
  value: type.identifier,
}));

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(clientSchedulesHistoriesSchema),
  initialValues: {
    userShiftTypes: typeOptions.map(option => option.value),
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  },
});

const onSubmit = handleSubmit(async (values) => {
  const payload = removeNullishKeys(values);
  await appointmentStore.getClientSchedulesHistories(payload);
});

async function onRestore(id: number) {
  await restoreClientSchedule(id);
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
        <div class="nav__item">
          <span>選擇項目</span>
          <OSelect class="nav__input" name="userShiftTypes" :options="typeOptions" hide-bottom-space multiple map-options outlined style="width: 164px;" />
        </div>
        <div class="nav__item--date">
          <span>時間區間</span>
          <OInput name="startDate" date-mode hide-bottom-space style="flex-grow: 1;" />
          <OInput name="endDate" date-mode hide-bottom-space style="flex-grow: 1;" />
        </div>
        <div class="nav__item--end">
          <QBtn label="查詢預約" outline style="width: 126px;height: 40px;" @click="onSubmit" />
          <QBtn label="清除" outline style="width: 80px;height: 40px;" @click="appointmentStore.resetClientSchedulesHistoriesState" />
        </div>
      </div>
    </div>
    <div class="query__body">
      <AppointmentQueryItem
        v-for="(item, idx) in appointmentStore.clientSchedulesHistories"
        :key="idx"
        :data="item"
        history-mode
        @restore="onRestore"
      />
      <!-- @cancel="cancelClientSchedule" -->
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
    &--date {
      @extend .nav__item;
      grid-column: span 2;
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
