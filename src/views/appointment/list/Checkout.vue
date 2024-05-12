<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { CheckTable } from '@/components/appointment';
import { ShiftType } from '@/const/general';
import { computed, ref } from 'vue';

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];

const props = defineProps<{
  scheduleId: string;
}>();

const appointmentStore = useAppointmentStore();
await appointmentStore.getClientSchedule(+props.scheduleId);
const { date, client, userShift } = appointmentStore.targetClientSchedule!;

const info: CheckTableData = [
  { key: 'date', value: date, span: true, custom: true },
  { key: 'name', value: client.name, label: '姓名' },
  { key: 'phone', value: client.phone, label: '電話' },
  { key: 'type', value: ShiftType[userShift.type], label: '項目' },
  { key: 'userName', value: userShift.user.name, label: '治療師' },
];

const payment: CheckTableData = [
  { key: 'title', value: '支付方式', span: true, custom: true },
  { key: 'payment', span: true, custom: true },
];
const selectedPayment = ref('cash');
const isPointType = computed(() => selectedPayment.value === 'points');
const paymentGroup = [
  { label: '現金', value: 'cash' },
  { label: '轉帳', value: 'transfer' },
  { label: '信用卡', value: 'creditCard' },
  { label: 'Line Pay', value: 'linePay' },
  { label: '街口', value: 'jkoPay' },
  { label: '點數', value: 'points' },
];

const details = computed<CheckTableData>(() => {
  const allDetails = [
    { key: 'selectGroup', custom: true },
    { key: 'remainingPoints', custom: true },
    { key: 'amount', span: true, custom: true },
    { key: 'detailTitle', label: '付款明細', span: true, custom: true },
    { key: 'cashDetails', label: '現金', span: true, custom: true },
    { key: 'groupDetails', span: true, custom: true },
  ];
  return selectedPayment.value === 'points'
    ? allDetails.filter(item => !['cashDetails'].includes(item.key))
    : allDetails.filter(item => !['selectGroup', 'remainingPoints', 'groupDetails'].includes(item.key));
},
);
const groupOptions = [
  { label: '群組1', value: 'group1' },
  { label: '群組2', value: 'group2' },
  { label: '群組3', value: 'group3' },
];
const selectedGroup = ref(groupOptions[0]);
const groupDetails = [
  { label: '群組', labelValue: selectedGroup.value.label, value: 150 },
  { label: '項目', labelValue: ShiftType[userShift.type], value: -4 },
  { label: '剩餘點數', value: 146 },
];

const amountInput = ref('2000');
</script>

<template>
  <div class="checkout">
    <CheckTable :data="info">
      <template #date="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
    </CheckTable>

    <CheckTable :data="payment">
      <template #title="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
      <template #payment>
        <QOptionGroup v-model="selectedPayment" :options="paymentGroup" inline left-label color="black" class="slot-padding--payment q-gutter-x-md" />
      </template>
    </CheckTable>

    <CheckTable :data="details ">
      <template #selectGroup>
        <div class="slot-padding">
          <QSelect v-model="selectedGroup" :options="groupOptions" borderless dense hide-bottom-space style="font-size: 16px;" />
        </div>
      </template>
      <template #remainingPoints>
        <div class="remaining-points slot-padding">
          <span>群組點數</span>
          <span>{{ 150 }} 點</span>
        </div>
      </template>
      <template #detailTitle="{ data }">
        <div class="slot-padding">
          {{ data.label }}
        </div>
      </template>
      <template #amount>
        <div class="amount slot-padding">
          <div class="amount-input">
            <span>結帳{{ isPointType ? '點數' : '金額' }}：</span>
            <input v-model="amountInput" type="text" class="amount-input__input">
            <span>{{ isPointType ? '點' : '元' }}</span>
          </div>
          <QBtn label="結帳" outline style="width: 125px; font-size: 16px" />
        </div>
      </template>
      <template #cashDetails>
        <div class="cash-details slot-padding">
          <span>現金</span>
          <span>${{ amountInput }}</span>
        </div>
      </template>
      <template #groupDetails>
        <div class="details slot-padding">
          <div v-for="(item, idx) in groupDetails" :key="idx" class="details__item">
            <div class="details__key">
              <span>{{ item.label }}</span>
              <span>{{ item.labelValue && `：${item.labelValue}` }}</span>
            </div>
            <div class="details__value">
              {{ item.value }} 點
            </div>
          </div>
        </div>
      </template>
    </CheckTable>
  </div>
</template>

<style lang="scss" scoped>
.checkout {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
</style>
