<script setup lang='ts'>
import { computed } from 'vue';
import { PaymentMethods } from '@/const/appointment';
import { CheckTable, PaymentComposition } from '@/components/appointment';
import type { PaymentDetail } from '@/api';
import { PointTypes, ShiftType, TransactionTypes } from '@/const/general';

const props = defineProps<{
  detail: PaymentDetail ;
}>();

const methodOptions = computed(() => Object.values(PaymentMethods).map(({ label, identifier }) => ({ label, value: identifier })));

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
const purchaseDetail = computed<CheckTableData>(() => {
  const data = props.detail;
  switch (data.type) {
    case TransactionTypes.門診費用:
      return [
        { key: 'date', value: data.date, span: true, custom: true },
        { key: 'name', value: data.clientName, label: '姓名' },
        { key: 'type', value: data.userShift?.type ? ShiftType[data.userShift.type] : '', label: '項目' },
        { key: 'userName', value: data.userShift?.user.name ?? '', label: '治療師' },
        { key: 'spaceName', value: data.spaceName ?? '', label: '場館' },
      ];
    case TransactionTypes.團課券購買:
      return [
        { key: 'date', value: data.date, span: true, custom: true },
        { key: 'name', value: data.clientName, label: '姓名' },
        { key: 'classId', value: data.groupClassName, label: '團課名稱' },
        { key: 'ticketGained', value: `${data.ticketGained} 張`, label: '數量' },
        { key: 'spaceName', value: data.spaceName ?? '', label: '場館' },
      ];
    case TransactionTypes.堂數交易:
    default:
      return [
        { key: 'date', value: data.date, span: true, custom: true },
        { key: 'name', value: data.clientName, label: '姓名' },
        { key: 'pointType', value: PointTypes[data.pointPaymentClientGroupType], label: '類別' },
        { key: 'groupName', value: data.pointPaymentClientGroupName, label: '群組' },
        { key: 'plan', value: data.pointPaymentPlan, label: '方案' },
        { key: 'paidPointGained', value: `${data.paidPointGained} 堂`, label: '點堂' },
        { key: 'giftPointGained', value: `${data.giftPointGained} 堂`, label: '贈堂' },
      ];
  }
});

type CompositionPayment = InstanceType<typeof PaymentComposition>['$props']['modelValue'];
const paymentDetail = computed(() => {
  switch (props.detail.type) {
    case TransactionTypes.團課券購買:
      return props.detail.groupClassTicketPaymentMultiChannelPay;
    case TransactionTypes.堂數交易:
      return props.detail.pointPaymentMultiChannelPay;
    case TransactionTypes.門診費用:
    default:
      return props.detail.clientSchedulePaymentMultiChannelPay;
  }
});
</script>

<template>
  <QCard style="width:650px; max-width: 90vw;">
    <QCardSection class="text-right">
      <QIcon v-close-popup name="close" color="black" class="cursor-pointer no-print" size="24px" />
    </QCardSection>

    <QCardSection class="payment_detail">
      <CheckTable :data="purchaseDetail">
        <template #date="{ data }">
          <div class="q-pa-sm">
            {{ data.value }}
          </div>
        </template>
      </CheckTable>
      <!-- @vue-ignore -->
      <PaymentComposition readonly :model-value="paymentDetail as CompositionPayment" :method-options="methodOptions" />

      <div class="payment_detail__sum">
        <p>交易總金額：</p>
        <div class="amount">{{ detail.amount }}</div>
        <span>元</span>
      </div>
    </QCardSection>
  </QCard>
</template>

<style scoped lang="scss">
.payment_detail {
  padding-bottom: 32px;
  > * + * {
    margin-top: 24px;
  }

  &__sum {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border: 1px solid #000;
    .amount {
      font-weight: 600;
      padding: 12px;
      background: #f5f5f5;
      width: 120px;
      border-radius: 4px;
    }
  }
}
</style>
