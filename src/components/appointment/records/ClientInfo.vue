<script setup lang="ts">
import { useAppointmentStore, useUserStore } from '@/stores';
import { getDurationLabel } from '@/utils/date';
import dayjs from 'dayjs';
import type { ScheduleVisitState } from '@/const/appointment';
import { PaymentState, ScheduleStateMap } from '@/const/appointment';
import router from '@/router';
import { useQuasar } from 'quasar';
import { type ClientScheduleDetail, RoleType, adjustEmployeePriceState, adjustFirstScheduleState, adjustScheduleTime, appointmentCheckIn, appointmentFinishService, cancelClientScheduleNotStarted, downloadContract, updateNote } from '@/api';
import { computed, ref } from 'vue';
import { OInput, TimeDurationPicker } from '@/components/shared';
import { ClientInfoTable, ScheduleModifyHistories } from '@/components/appointment';
import { getType } from '@/utils/mappers';
import { useNotify } from '@/composables/notify';
import FirstScheduleForm from './FirstScheduleForm.vue';
import EmployeePriceForm from './EmployeePriceForm.vue';
import { PhysicalTypes } from '@/const/general';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

type Duration = InstanceType<typeof TimeDurationPicker>['$props']['modelValue'];

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();

const isEditingTime = ref(false);
const schedule = computed(() => appointmentStore.targetClientSchedule!);
const client = computed(() => schedule.value.client);
const userShift = computed(() => schedule.value.userShift);
const scheduleState = computed(() => ScheduleStateMap.get(schedule.value.state)!.label);
const canEditTime = computed(() => ScheduleStateMap.get(schedule.value.state)!.canEditTime && getType(userShift.value.type)?.canEditTime);
const duration = computed(() => ({
  start: schedule.value.scheduleStartTime,
  end: schedule.value.scheduleEndTime,
}));
const isCheckedOut = computed(() => schedule.value.paymentState === 2);
const canCheckout = computed(() => ScheduleStateMap.get(schedule.value.state)?.canCheckout);
// const beforeCheckIn = computed(() => schedule.value.state === 1);

const data = computed(() => {
  const all = [
    { key: 'name', label: '姓名', value: client.value.name },
    { key: 'isFirstClientSchedule', label: '初診', value: schedule.value.isFirstClientSchedule ? '初診' : '複診' },
    { key: 'isEmployeePrice', label: '員工價', value: schedule.value.isEmployeePrice },
    { key: 'autoRecommendation', label: '自動推薦', value: schedule.value.isUsingAutoRecommend },
    { key: 'lineId', label: 'LINE ID', value: client.value.lineUserId },
    { key: 'liffIntroducerName', label: '介紹人', value: client.value.liffIntroducerName ?? '未填寫' },
    { key: 'phone', label: '電話', value: client.value.phone },
    { key: 'address', label: '地址', value: client.value.address ?? '無' },
    { key: 'date', label: '日期', value: dayjs(schedule.value.date).format('YYYY/MM/DD') },
    { key: 'time', label: '時間', value: getDurationLabel(schedule.value.scheduleStartTime, schedule.value.scheduleEndTime) },
    { key: 'location', label: '地點', value: userShift.value.space?.name ?? '' },
    { key: 'doctor', label: '治療師/教練', value: userShift.value?.user?.name ?? '' },
    { key: 'firstVisitContract', label: '預約就診須知', value: client.value?.firstVisitContractUrl ?? null },
    { key: 'note', label: '預約備註', value: schedule.value.note, custom: true },
  ];
  // 只有物理治療相關項目顯示初診欄位
  return PhysicalTypes.includes(+userShift.value.type) ? all : all.filter(field => field.key !== 'firstVisitContract');
});

const states = computed(() => [
  { label: '狀態', value: scheduleState.value },
  // { label: '更改時間', value: '2024/01/03' },
  // { label: '更改人帳號', value: 'example@gmail.com' },
]);

function rearrangeClientSchedule() {
  appointmentStore.targetClientScheduleNotStarted = appointmentStore.targetClientSchedule;
  router.push({ name: 'appointmentOngoingRearrange' });
}

function cancelClientSchedule() {
  $q.dialog({
    message: '是否確定要取消預約？',
  }).onOk(async () => {
    try {
      await cancelClientScheduleNotStarted(schedule.value.id);
      await appointmentStore.getClientSchedule(schedule.value.id);
      router.push({ name: 'appointmentListCalendar' });
      useNotify('取消預約成功');
    }
    catch (err) {
      console.log(err);
    }
  });
}

async function checkIn() {
  try {
    await appointmentCheckIn(schedule.value.id);
    await appointmentStore.getClientSchedule(schedule.value.id);
    $q.notify({ message: '已報到', timeout: 2000, position: 'top' });
  }
  catch (err) {
    console.log(err);
  }
}
async function finishService() {
  try {
    await appointmentFinishService(schedule.value.id);
    await appointmentStore.getClientSchedule(schedule.value.id);
    $q.notify({ message: '已完成服務', timeout: 2000, position: 'top' });
  }
  catch (err) {
    console.log(err);
  }
}
// async function finishRecord() {
//   await appointmentFinishRecord(schedule.value.id);
//   await appointmentStore.getClientSchedule(schedule.value.id);
// }

// 預約備註
const note = ref(schedule.value.note);

async function saveNote() {
  if (!note.value)
    return;

  await updateNote(props.scheduleId, note.value);
  $q.notify({ message: '已存檔！', timeout: 2000, position: 'center' });
}

async function updateTime({ start, end }: Duration) {
  try {
    await adjustScheduleTime(+props.scheduleId, {
      startTime: start,
      endTime: end,
    });
    await appointmentStore.getClientSchedule(+props.scheduleId);
    $q.notify({ message: '時間已調整', timeout: 2000, position: 'top' });
    isEditingTime.value = false;
  }
  catch (err) {
    console.log(err);
  }
}

function limitTimeOptions(hr: number, min: number | null) {
  return min !== null
    ? min % 5 === 0
    : true;
}

const ifNoLiffIntroducer = computed(() => (client.value.howToKnowUs === '朋友推薦' || client.value.howToKnowUs === '家人推薦') && !client.value.liffIntroducerName);

// 初診狀態
const hasFirstSchedulePermission = computed(() => userStore.userInfo?.role.type === RoleType['院長'] || userStore.userInfo?.role.type === RoleType['副院長'] || userStore.userInfo?.role.type === RoleType['系統管理者']);

const isEditingFirstSchedule = ref(false);
async function handleFirstScheduleChange(state: ScheduleVisitState) {
  isEditingFirstSchedule.value = false;
  await adjustFirstScheduleState({ clientScheduleId: +props.scheduleId, firstScheduleState: state });
  useNotify('初診狀態編輯成功');
  await appointmentStore.getClientSchedule(+props.scheduleId);
}

// 員工價
const isEditingEmployeePrice = ref(false);
async function handleEmployeePriceChange(state: boolean) {
  isEditingEmployeePrice.value = false;
  await adjustEmployeePriceState({ clientScheduleId: +props.scheduleId, isEmployeePrice: state });
  useNotify('員工價編輯成功');
  await appointmentStore.getClientSchedule(+props.scheduleId);
}

// 就診須知合約下載
async function handleDownload(contractUrl: string) {
  if (!contractUrl)
    return;

  window.open(contractUrl);
}
</script>

<template>
  <div class="client-info">
    <div class="client-info__header">
      <div class="misc">
        <p class="member-id">
          <span>會員編號</span><span>{{ scheduleDetail.clientId }}</span>
        </p>
        <div class="payment-state">
          <QChip v-if="schedule.paymentState === PaymentState.未結帳" square :ripple="false" style="background-color: #F8C9CB;">未結帳</QChip>
        </div>
        <ScheduleModifyHistories :data="appointmentStore.scheduleModifyHistories" />
      </div>
    </div>
    <div class="client-info__body">
      <ClientInfoTable :data="data">
        <template #name="{ row }">
          <div class="name">
            <a class="link" @click="$router.push({ name: 'clientInfo', params: { clientId: scheduleDetail.clientId } })">{{ row.value }}</a>
            <div v-if="scheduleDetail.isFirstClientSchedule">
              <QBadge color="grey-14" class="q-ml-lg q-px-sm q-py-xs text-weight-medium">初診</QBadge>
            </div>
          </div>
        </template>
        <template #isFirstClientSchedule="{ row }">
          <div class="flex items-center justify-between">
            <span>{{ row.value }}</span>
            <div v-if="hasFirstSchedulePermission">
              <QBtn round flat icon="edit" size="sm" @click="isEditingFirstSchedule = true" />
            </div>
          </div>
        </template>
        <template #isEmployeePrice="{ row }">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <QIcon v-if="row.value" name="check_circle" color="green" class="q-mr-sm" />
              <span>{{ row.value ? '是 (享有員工價)' : '否' }}</span>
            </div>
            <div>
              <QBtn round flat icon="edit" size="sm" @click="isEditingEmployeePrice = true" />
            </div>
          </div>
        </template>
        <template #autoRecommendation="{ row }">
          <QIcon v-if="row.value" name="check_circle" color="green" class="q-mr-sm" />
          <span>{{ row.value ? '是（選擇自動推薦治療師）' : '否' }}</span>
        </template>

        <template #lineId="{ row }">
          <div v-if="row.value">{{ row.value }}</div>
          <QBadge v-else color="red-1" text-color="red-10" class="text-weight-bold q-mx-sm">LINE 未綁定</QBadge>
        </template>
        <template #liffIntroducerName="{ row }">
          <div class="liffIntroducerName">
            <div v-if="ifNoLiffIntroducer" class="liffIntroducerName__value">客戶填寫 - &ensp;<div>{{ row.value }}</div></div>
            <div class="liffIntroducerName__value">
              後台綁定
              <template v-if="!client.introducer">
                <QBadge color="red-1" text-color="red-10" class="text-weight-bold q-mx-sm">介紹人未綁定</QBadge>
                <a class="link" @click="$router.push({ name: 'clientInfo', params: { clientId: scheduleDetail.clientId } })">前往綁定</a>
              </template>
              <template v-else>
                - &ensp;
                <a class="link" @click="$router.push({ name: 'clientInfo', params: { clientId: client.introducer.id } })">{{ client.introducer.name }}</a>
              </template>
            </div>
          </div>
        </template>
        <template #time="{ row }">
          <div class="time">
            <div class="time__input">
              <p v-if="!isEditingTime">{{ row.value }}</p>
              <TimeDurationPicker v-else :model-value="duration" :options="limitTimeOptions" @cancel="isEditingTime = false" @update:model-value="updateTime" />
            </div>
            <div class="time__actions">
              <QBtn v-if="!isEditingTime" rounded flat icon="edit" size="sm" :disable="!canEditTime" outline class="time__actions-edit" @click="isEditingTime = true" />
            </div>
          </div>
        </template>
        <template #firstVisitContract="{ row }">
          <a v-if="!!row.value" class="link" @click="handleDownload(row.value as string)">預約就診須知合約.pdf</a>
          <span v-else> - </span>
        </template>
        <template #note>
          <div class="note">
            <OInput v-model="note" name="note" hide-bottom-space type="textarea" class="full-width" placeholder="請輸入預約備註" />
            <QBtn outline label="儲存" :disable="!note" class="note__btn" @click="saveNote" />
          </div>
        </template>
      </ClientInfoTable>
    </div>
    <div class="client-info__caption">
      <div class="state">
        <p v-for="(state, idx) in states" :key="idx" class="state__item">
          <span>{{ state.label }}：</span>
          <span class="state__value">{{ state.value }}</span>
        </p>
      </div>
    </div>
    <div class="client-info__actions">
      <div class="actions">
        <QBtn v-if="!isCheckedOut && canCheckout" :disable="!appointmentStore.isSameSpaceClinicSchedule" class="actions__item--checkout" label="結帳" icon="attach_money" color="primary" style="width: 127px;" @click="$router.push({ name: 'appointmentListCheckout', params: { scheduleId: schedule.id } })" />
        <QBtn class="actions__item--rearrange" label="預約改期" :disable="schedule.state > 2 || !appointmentStore.isSameSpaceClinicSchedule" outline style="width: 127px;" @click="rearrangeClientSchedule" />
        <QBtn class="actions__item--cancel" label="取消預約" :disable="schedule.state > 2 || !appointmentStore.isSameSpaceClinicSchedule" color="red-10" style="width: 127px;" @click="cancelClientSchedule" />
        <div class="actions__item--space" />
        <div class="actions__item--toggler">
          <QBtn v-if="scheduleState === '預約'" label="報到" color="black" style="width: 127px;" @click="checkIn" />
          <QBtn v-else-if="scheduleState === '報到'" label="完成服務" color="black" style="width: 127px;" :disable="appointmentStore.needToSignFirstVisit" @click="finishService" />
          <!-- <QBtn v-else-if="scheduleState === '完成服務'" label="病例完成" color="black" style="width: 127px;" @click="finishRecord" /> -->
        </div>
      </div>
    </div>
  </div>
  <QDialog v-model="isEditingFirstSchedule">
    <FirstScheduleForm :client-name="client.name" :init-val="schedule.isFirstClientSchedule" @cancel="isEditingFirstSchedule = false" @confirm="handleFirstScheduleChange" />
  </QDialog>
  <QDialog v-model="isEditingEmployeePrice">
    <EmployeePriceForm :client-name="client.name" :init-val="schedule.isEmployeePrice" @cancel="isEditingEmployeePrice = false" @confirm="handleEmployeePriceChange" />
  </QDialog>
</template>

<style lang="scss" scoped>
.client-info {
  &__header {
    margin-bottom: 15px;
  }
  &__caption {
    margin-bottom: 16px;
  }
  &__actions {
    // display: flex;
    // justify-content: flex-end;
  }

  .link {
    color: #1a7ab3;
    text-decoration: underline;
    cursor: pointer;
  }
}

.member-id {
  display: flex;
  gap: 13px;
  padding: 10px;
}

.time {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  &__input {
  }
  &__actions {
    // flex-grow: 1;
  }
  &__actions-edit {
    margin-left: auto;
  }
  &__actions-save {
    display: flex;
    gap: 10px;
  }
}

.note {
  display: flex;
  flex-direction: column;
  gap: 15px;
  &__btn {
    align-self: flex-end;
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

// .actions {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-end;
//   &__rearrange {
//     display: flex;
//     // flex-direction: column;
//     align-items: center;
//     gap: 10px;
//   }
// }

.actions {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  column-gap: 16px;
  row-gap: 16px;
  padding: 0 0 16px 0;
  &__item {
    &--checkout {
      grid-column: 1 / 5;
      justify-self: end;
    }
  }
}

.table__item {
  display: flex;
}

.name {
  height: 19.19px;
  display: flex;
  align-items: center;
}

.misc {
  display: grid;
  grid-template-columns: auto 1fr auto;
}

.liffIntroducerName {
  display: flex;
  gap: 20px;
  > div + div {
    margin-left: 26px;
  }
  &__value {
    display: flex;
    align-items: center;
  }
}
</style>
