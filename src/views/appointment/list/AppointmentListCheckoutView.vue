<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { AddOnTable, CheckTable, CheckoutAction, PaymentComposition, PriceTags, Receipt } from '@/components/appointment';
import { ShiftType, Types } from '@/const/general';
import { PaymentMethod, PaymentMethods } from '@/const/appointment';
import { computed, ref, watch } from 'vue';
import { calcReceiptAmount, checkGender } from '@/utils/helpers';
import { checkout } from '@/api/appointment';
import router from '@/router';
import { useQuasar } from 'quasar';

const props = defineProps<{
  scheduleId: string;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const $q = useQuasar();
const appointmentStore = useAppointmentStore();
await appointmentStore.getClientSchedule(+props.scheduleId);

const { id: scheduleId, date: scheduleDate, client, userShift, addOnServices, isUsingAutoRecommend, isEmployeePrice } = (appointmentStore.targetClientSchedule!);

await appointmentStore.getClientGroup(client.id);
const shiftType = computed(() => Object.values(Types).find(item => item.identifier === userShift.type)!);
const totalAmount = ref(2000);
const payments = ref<Payments>([]);

const info: CheckTableData = [
  { key: 'date', value: scheduleDate, span: true, custom: true },
  { key: 'name', value: client.name, label: '姓名' },
  { key: 'phone', value: client.phone, label: '電話' },
  { key: 'userName', value: userShift?.user.name, label: '治療師', span: true },
  { key: 'type', value: shiftType.value?.label, label: '項目', span: true },
];

const hasAddOn = computed(() => addOnServices.some(addOn => addOn.isAddOn));
const addOns: CheckTableData = [
  { key: 'title', value: '加購服務', span: true, custom: false },
  { key: 'item1', value: '儀器治療', label: '項目' },
];

const groupOptions = appointmentStore.targetClientGroup.filter((group) => {
  const appointmentGroupType = Object.values(Types).find(type => type.identifier === userShift.type)?.pointType;
  return group.type === appointmentGroupType;
}).map(item => ({
  label: item.name,
  value: item.id,
  points: item.points,
}));

const spaceName = computed(() => userShift.space?.name);

const receiptData = computed(() => {
  return [
    { name: 'name', label: '病患姓名', value: client.name },
    { name: 'gender', label: '性別', value: checkGender(client.identityNumber)?.label },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    { name: 'amount', label: '金額', value: calcReceiptAmount(payments.value) },
    { name: 'declaration', label: '健保申報', value: '無' },
    { name: 'selfPay', label: '自費項目', value: ShiftType[userShift.type] },
    { name: 'userName', label: '治療師', value: userShift.user.name },
  ];
});

const isReceiptDialogOpen = ref(false);
const methodOptions = computed(() => {
  const options = Object.values(PaymentMethods).filter(({ forCheckout }) => forCheckout).map(({ label, identifier }) => ({ label, value: identifier }));
  return appointmentStore.targetClientSchedule?.userShift.type === ShiftType['團課']
    ? options.filter(option => option.value === PaymentMethod['團課卷'])
    : options.filter(option => option.value !== PaymentMethod['團課卷']);
});

async function onCheckout() {
  $q.loading.show({ delay: 0 });
  try {
    await checkout(scheduleId, {
      amount: totalAmount.value,
      multiChannelPay: payments.value,
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
  return [{ label: '初診專案(自動推薦治療師)', value: isUsingAutoRecommend }, { label: '員工價', value: isEmployeePrice }].filter(item => item.value).map(item => item.label);
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
      <Receipt :rows="receiptData" :space-name="spaceName" @checkout="onCheckout" />
    </QDialog>

    <CheckTable :data="info">
      <template #date="{ data }">
        <div class="slot-padding">{{ data.value }}</div>
      </template>
    </CheckTable>

    <AddOnTable v-if="hasAddOn" :data="addOns" />

    <PriceTags :list="priceTags" />

    <CheckoutAction v-model="totalAmount" @checkout="isReceiptDialogOpen = true" />
    <PaymentComposition v-model="payments" :method-options="methodOptions" :group-options="groupOptions" />
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
