<script setup lang="ts">
import { useAppointmentStore, useUserStore } from '@/stores';
import { CheckTable, CheckoutAction, PaymentComposition, PriceTags, Receipt } from '@/components/appointment';
import { AddOnServiceTypes, PointTypes, ShiftType, Types } from '@/const/general';
import { PaymentMethod, PaymentMethods } from '@/const/appointment';
import { computed, ref, watch } from 'vue';
import { calcReceiptAmount } from '@/utils/helpers';
import { checkout } from '@/api';
import router from '@/router';
import { useQuasar } from 'quasar';
import { useDialog } from '@/composables/dialog';

const props = defineProps<{
  scheduleId: string;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
await getCheckoutInfo();

async function getCheckoutInfo() {
  await Promise.allSettled([appointmentStore.getClientSchedule(+props.scheduleId), userStore.getUsers()]);
  if (!appointmentStore.isSameSpaceClinicSchedule) {
    const { onOk, onCancel } = await useDialog({
      title: '系統提示',
      message: '此預約單並非此場館，無法進行此操作',
      type: 'confirm',
    });
    onOk(() => router.push({ name: 'appointmentListCalendar' }));
    onCancel(() => router.push({ name: 'appointmentListCalendar' }));
  }
}

const { id: scheduleId, date: scheduleDate, client, userShift, addOnServices, isUsingAutoRecommend, isEmployeePrice, isFirstClientSchedule, record } = (appointmentStore.targetClientSchedule!);

await appointmentStore.getClientGroup(client.id);
const shiftType = computed(() => Object.values(Types).find(item => item.identifier === userShift.type)!);
const totalAmount = ref(2000);
const payments = ref<Payments>([]);

const addOnList = computed(() => addOnServices.filter(addOn => addOn.isAddOn));
const info: CheckTableData = [
  { key: 'date', value: scheduleDate, span: true, custom: true },
  { key: 'name', value: client.name, label: '姓名' },
  { key: 'phone', value: client.phone, label: '電話' },
  { key: 'userName', value: userShift?.user.name, label: '治療師' },
  { key: 'type', value: shiftType.value?.label, label: '項目' },
  ...(userShift.type === ShiftType['震波'] ? [{ key: 'independentShockWaveShots', label: '發數', value: `${record.independentShockWaveShots ?? '0'}發` }] : []),
  ...(addOnList.value.length > 0 ? [{ key: 'addOns', label: '加購服務', value: addOnList.value.map(addOn => addOn.serviceName).join('、') }] : []),
  ...(addOnList.value.some(addOn => addOn.serviceType === AddOnServiceTypes['震波']) ? [{ key: 'addOnServiceShockWaveShots', label: '加購發數', value: `${record.addOnServiceShockWaveShots ?? '0'}發` }] : []),
];

const allowMultiPointPayment = computed(() => addOnList.value.length > 0);
const groupOptions = appointmentStore.targetClientGroup.filter((group) => {
  const availablePointGroupTypes = Object.values(Types).find(type => type.identifier === userShift.type)?.pointType;

  let addOnPointType: Partial<PointTypes>[] = [];
  // 內含加購包含儀器治療，也可使用儀器相關點數群組
  if (allowMultiPointPayment.value) {
    const list = addOnList.value.map((addOn) => {
      switch (addOn.serviceType) {
        case AddOnServiceTypes['射頻']:
          return PointTypes['射頻'];
        case AddOnServiceTypes['磁波']:
          return PointTypes['磁波'];
        case AddOnServiceTypes['震波']:
          return PointTypes['震波'];
        default:
          return null;
      }
    }).filter(g => g !== null);
    addOnPointType = list as Partial<PointTypes>[];
  }
  return availablePointGroupTypes?.includes(group.type) || addOnPointType.includes(group.type);
}).map(item => ({
  label: item.name,
  value: item.id,
  points: item.points,
  pointType: item.type,
}));

const receiptData = computed(() => {
  return [
    { name: 'name', label: '病患姓名', value: client.name },
    { name: 'gender', label: '性別', value: client.gender },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    { name: 'amount', label: '金額', value: calcReceiptAmount(payments.value) },
    { name: 'declaration', label: '健保申報', value: '無' },
    { name: 'selfPay', label: '自費項目', value: ShiftType[userShift.type] },
    { name: 'userName', label: '治療師', value: userShift.user.name },
    ...(userShift.type === ShiftType['震波'] ? [{ name: 'independentShockWaveShots', label: '發數', value: `${record.independentShockWaveShots ?? '0'}發` }] : []),
    ...addOnList.value.length > 0 ? [{ name: 'addOn', label: '加購服務', value: addOnList.value.map(a => a.serviceName).join('、') }] : [],
    ...(addOnList.value.some(addOn => addOn.serviceType === AddOnServiceTypes['震波']) ? [{ name: 'addOnServiceShockWaveShots', label: '加購發數', value: `${record.addOnServiceShockWaveShots ?? '0'}發` }] : []),
  ];
});

const isReceiptDialogOpen = ref(false);
const methodOptions = computed(() => {
  const options = Object.values(PaymentMethods).filter(({ forCheckout }) => forCheckout).map(({ label, identifier }) => ({ label, value: identifier }));
  return appointmentStore.targetClientSchedule?.userShift.type === ShiftType['團課']
    ? options.filter(option => option.value === PaymentMethod['團課卷'])
    : options.filter(option => option.value !== PaymentMethod['團課卷']);
});

const sellerIds = ref([]);
async function onCheckout() {
  $q.loading.show({ delay: 0 });
  try {
    await checkout(scheduleId, {
      amount: totalAmount.value,
      multiChannelPay: payments.value,
      sellerIds: sellerIds.value,
      chargerId: userShift.user.id,
    });
    $q.notify({ message: '已結帳', timeout: 2000, position: 'top', color: 'positive' });
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }

  router.push({ name: 'appointmentListCalendar', query: { date: scheduleDate } });
}

const priceTags = computed(() => {
  const eligibleForFirst = shiftType.value.identifier !== ShiftType['教練課'] && shiftType.value.identifier !== ShiftType['運動諮詢'];
  return [{ label: '初診專案(自動推薦治療師)', value: eligibleForFirst && isFirstClientSchedule && isUsingAutoRecommend }, { label: '員工價', value: isEmployeePrice }].filter(item => item.value).map(item => item.label);
});

// set amount to $0 when payment method is 堂數
watch(payments, (chosenPayments) => {
  const includePointPayment = chosenPayments.some(pay => pay.payMethod === PaymentMethod['堂數']);
  if (includePointPayment && totalAmount.value !== 0) {
    totalAmount.value = 0;
  }
});
</script>

<template>
  <div class="checkout">
    <QDialog v-model="isReceiptDialogOpen" persistent>
      <Receipt
        :rows="receiptData" :space-name="userShift?.space.name" :space-id="userShift.spaceId"
        @checkout="onCheckout"
      />
    </QDialog>

    <CheckTable :data="info">
      <template #date="{ data }">
        <div class="slot-padding">{{ data.value }}</div>
      </template>
    </CheckTable>

    <PriceTags :list="priceTags" />

    <fieldset>
      <legend class="text-title-medium q-mb-md">負責人與銷售者</legend>
      <QInput label="負責人" disable outlined filled class="q-mb-md" dense :model-value="userShift?.user.name" color="teal" />
      <QSelect v-model="sellerIds" multiple label="銷售者(選填、可複選)" :options="userStore.activeUsers" error-message="" outlined dense emit-value map-options />
    </fieldset>
    <CheckoutAction v-model="totalAmount" @checkout="isReceiptDialogOpen = true" />
    <PaymentComposition v-model="payments" :method-options="methodOptions" :group-options="groupOptions" :multi-point="allowMultiPointPayment" />
  </div>
</template>

<style lang="scss" scoped>
.checkout {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 676px;
}

.slot-padding {
  padding: 10px;

  &--payment {
    @extend .slot-padding;
    padding: 18px 10px;
  }
}

.remaining-points {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount {
  display: flex;
  justify-content: space-between;
}

.amount-input {
  display: flex;
  align-items: center;
  gap: 5px;

  &__input {
    width: 134px;
    padding: 10px;
    text-align: right;
    border: none;
    background-color: #f5f5f5;
    outline: none;
  }
}

.cash-details {
  display: flex;
  justify-content: space-between;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__item {
    display: flex;
    justify-content: space-between;
  }
}

.checkout-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
