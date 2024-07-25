<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { CheckTable, PaymentComposition, Receipt } from '@/components/appointment';
import { ShiftType, Types } from '@/const/general';
import { PaymentMethod, PaymentMethods } from '@/const/appointment';
import { computed, ref } from 'vue';
import { checkGender } from '@/utils/helpers';
import { checkout } from '@/api/appointment';
import router from '@/router';

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const props = defineProps<{
  scheduleId: string;
}>();

const appointmentStore = useAppointmentStore();
await appointmentStore.getClientSchedule(+props.scheduleId);

const { id: scheduleId, date: scheduleDate, client, userShift } = (appointmentStore.targetClientSchedule!);

await appointmentStore.getClientGroup(client.id);
const shiftType = computed(() => Object.values(Types).find(item => item.identifier === userShift.type)!);
// const amountInput = ref('');
const totalAmount = ref(2000);
const payments = ref<Payments>([]);

const info: CheckTableData = [
  { key: 'date', value: scheduleDate, span: true, custom: true },
  { key: 'name', value: client.name, label: '姓名' },
  { key: 'phone', value: client.phone, label: '電話' },
  { key: 'type', value: shiftType.value?.label, label: '項目' },
  { key: 'userName', value: userShift?.user.name, label: '治療師' },
];

// const selectedPayment = ref(1);
// const isPointType = computed(() => selectedPayment.value === PaymentMethod['點數']);
const groupOptions = appointmentStore.targetClientGroup.map(item => ({
  label: item.name,
  value: item.id,
  points: item.points,
}));

// watch(isPointType, (newType: boolean) => {
//   if (newType) {
//     return amountInput.value = shiftType.value.calcAmount(true).toString();
//   }
//   amountInput.value = shiftType.value.calcAmount().toString();
// }, { immediate: true });

const spaceName = computed(() => userShift.space?.name);

const receiptData = computed(() => {
  return [
    { name: 'name', label: '病患姓名', value: client.name },
    { name: 'gender', label: '性別', value: checkGender(client.identityNumber)?.label },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    { name: 'amount', label: '金額', value: getReceiptAmount() },
    { name: 'declaration', label: '健保申報', value: '無' },
    { name: 'selfPay', label: '自費項目', value: ShiftType[userShift.type] },
    { name: 'userName', label: '治療師', value: userShift.user.name },
  ];
});

const isReceiptDialogOpen = ref(false);
const methodOptions = computed(() => {
  const options = Object.values(PaymentMethods).map(({ label, identifier }) => ({ label, value: identifier }));
  return appointmentStore.targetClientSchedule?.userShift.type === ShiftType['團課']
    ? options.filter(option => option.value === PaymentMethod['團課卷'])
    : options.filter(option => option.value !== PaymentMethod['團課卷']);
});

function onPrint() {
  window.print();
}

async function onCheckout() {
  await checkout(scheduleId, {
    totalAmount: totalAmount.value,
    payments: payments.value,
  });
  router.push({ name: 'appointmentListCalendar' });
}

function getReceiptAmount() {
  const total = payments.value.reduce((acc, { payMethod, payAmount }) => {
    const paymentDetail = Object.values(PaymentMethods).find(item => item.identifier === payMethod)!;
    if (!paymentDetail.calcInReceipt || payAmount === null) {
      return acc;
    }
    if (!paymentDetail.isDiscount) {
      return acc += payAmount;
    }
    return acc -= payAmount;
  }, 0);
  return total;
}
</script>

<template>
  <div class="checkout">
    <QDialog v-model="isReceiptDialogOpen" persistent>
      <Receipt :rows="receiptData" :space-name="spaceName" @print="onPrint" @checkout="onCheckout" />
    </QDialog>

    <CheckTable :data="info">
      <template #date="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
    </CheckTable>

    <div class="actions">
      <div class="actions__amount">
        <p>交易總金額：</p>
        <QInput v-model.number="totalAmount" type="number" outlined dense style="width: 120px;" />
        <span>元</span>
      </div>
      <div class="actions__checkout">
        <QBtn label="結帳" outline style="width: 150px; font-size: 16px" @click="isReceiptDialogOpen = true" />
      </div>
    </div>
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

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #000;
  &__amount {
    display: flex;
    align-items: center;
    gap: 20px;
    > p {
      font-weight: 600;
    }
  }
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
