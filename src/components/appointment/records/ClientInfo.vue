<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { getDurationLabel } from '@/utils/date';
import dayjs from 'dayjs';
import { ScheduleStateMap } from '@/const/appointment';
import router from '@/router';
import { useQuasar } from 'quasar';
import { appointmentCheckIn, appointmentFinishRecord, appointmentFinishService, cancelClientScheduleNotStarted } from '@/api/appointment';
import { computed } from 'vue';

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const schedule = computed(() => appointmentStore.targetClientSchedule!);
const client = computed(() => schedule.value.client);
const userShift = computed(() => schedule.value.userShift);
const scheduleState = computed(() => ScheduleStateMap.get(schedule.value.state)!.label);

const data = computed(() => [
  { label: '姓名', value: client.value.name },
  { label: '電話', value: client.value.phone },
  { label: '地址', value: '台中市西屯區青海路(mock data)' },
  { label: '日期', value: dayjs(schedule.value.date).format('YYYY/MM/DD') },
  { label: '時間', value: getDurationLabel(schedule.value.scheduleStartTime, schedule.value.scheduleEndTime) },
  { label: '地點', value: userShift.value.space?.name },
  { label: '醫師', value: userShift.value.name },
]);

const states = computed(() => [
  { label: '狀態', value: scheduleState.value },
  // { label: '更改時間', value: '2024/01/03' },
  // { label: '更改人帳號', value: 'example@gmail.com' },
]);

function rearrangeClientSchedule() {
  appointmentStore.targetClientScheduleNotStarted = appointmentStore.targetClientSchedule;
  router.push({ name: 'appointmentCurrentQueryRearrange' });
}

function cancelClientSchedule() {
  $q.dialog({
    message: '是否確定要取消預約？',
  }).onOk(async () => {
    await cancelClientScheduleNotStarted(schedule.value.id);
    await appointmentStore.getClientSchedule(schedule.value.id);
  });
}

async function checkIn() {
  await appointmentCheckIn(schedule.value.id);
  await appointmentStore.getClientSchedule(schedule.value.id);
}
async function finishService() {
  await appointmentFinishService(schedule.value.id);
  await appointmentStore.getClientSchedule(schedule.value.id);
}
async function finishRecord() {
  await appointmentFinishRecord(schedule.value.id);
  await appointmentStore.getClientSchedule(schedule.value.id);
}
</script>

<template>
  <div class="client-info">
    <div class="client-info__header">
      <p class="member-id">
        <span>會員編號</span><span>201712879733</span>
      </p>
    </div>
    <div class="client-info__body">
      <ul class="table">
        <template
          v-for="(item, idx) in data"
          :key="idx"
        >
          <li class="table__item">
            {{ item.label }}
          </li>
          <li class="table__item">
            {{ item.value }}
          </li>
          <QSeparator color="black" class="table__separator" />
        </template>
      </ul>
    </div>
    <div class="client-info__caption">
      <div class="state">
        <p
          v-for="(state, idx) in states"
          :key="idx"
          class="state__item"
        >
          <span>{{ state.label }}：</span>
          <span class="state__value">{{ state.value }}</span>
        </p>
      </div>
    </div>
    <div class="client-info__actions">
      <div class="actions">
        <div class="actions__rearrange">
          <QBtn label="預約改期" :disable="schedule.state > 2" outline style="width: 127px;" @click="rearrangeClientSchedule" />
          <QBtn label="取消預約" :disable="schedule.state > 2" outline style="width: 127px;" @click="cancelClientSchedule" />
        </div>
        <div class="actions__checkin">
          <QBtn v-if="scheduleState === '預約'" label="報到" outline style="width: 127px;" @click="checkIn" />
          <QBtn v-else-if="scheduleState === '報到'" label="完成服務" outline style="width: 127px;" @click="finishService" />
          <QBtn v-else-if="scheduleState === '完成服務'" label="病例完成" outline style="width: 127px;" @click="finishRecord" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.client-info {
  &__header {
    margin-bottom: 15px;
  }
  &__caption {
    margin-bottom: 25px;
  }
  &__actions {
    // display: flex;
    // justify-content: flex-end;
  }
}

.member-id {
  display: flex;
  gap: 13px;
  padding: 10px;
}

.table {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 25px;
  &__item {
    padding: 10px;
  }
  &__separator {
    grid-column: span 3;
    margin-bottom: 15px;
  }
}

.state {
  display: flex;
  gap: 20px;
  font-size: 12px;
  &__item {
    display: flex;
    gap: 10px;
  }
  &__value {
    color: #e86969;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  &__rearrange {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
