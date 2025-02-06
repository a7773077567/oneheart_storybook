<script setup lang='ts'>
import { computed, ref } from 'vue';
import type { QTableProps } from 'quasar';
import { type PurchaseRecord, getClientPaymentDetail, getClientPayments, getSinglePayment } from '@/api';
import type { PointTypes } from '@/const/general';
import { AddOnServiceTypes, PaymentTypes, ShiftType, TransactionTypes } from '@/const/general';
import { Receipt } from '@/components/appointment';
import { calcReceiptAmount, showDecimal } from '@/utils/helpers';
import PaymentDetail from '@/components/order/PaymentDetail.vue';
import { Space } from '@/const/space';
import { pointUnit } from '@/const/points';

type ReceiptData = InstanceType<typeof Receipt>['$props']['rows'];

const props = defineProps<{
  clientId: string;
}>();

const rows = ref<PurchaseRecord[]>([]);
rows.value = await getClientPayments(+props.clientId);

const cols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    style: 'width:1px',
    field: row => row.date,
  },
  {
    name: 'spaceName',
    required: true,
    label: '場館',
    align: 'left',
    field: row => row.spaceName,
  },
  {
    name: 'type',
    required: true,
    label: '項目',
    align: 'left',
    field: row => TransactionTypes[row.type],
  },
  {
    name: 'payMethod',
    required: true,
    label: '支付方式',
    align: 'left',
    field: ({ type, clientSchedulePaymentMultiChannelPay: Medical, groupClassTicketPaymentMultiChannelPay: voucher, pointPaymentMultiChannelPay: point }) => {
      switch (type) {
        case TransactionTypes.門診費用:
          return Medical.length > 1 ? '複合式結帳' : PaymentTypes[Medical[0].payMethod];
        case TransactionTypes.團課券購買:
        case TransactionTypes.團課券退款:
          return voucher.length > 1 ? '複合式結帳' : PaymentTypes[voucher[0].payMethod];
        case TransactionTypes.堂數交易:
        case TransactionTypes.堂數退款:
          return point.length > 1 ? '複合式結帳' : PaymentTypes[point[0].payMethod];
        default:
          return '';
      }
    },
  },
  {
    name: 'amount',
    required: true,
    label: '堂(張)數 / 金額',
    align: 'left',
    field: ({ type, amount, ticketGained, paidPointGained, giftPointGained, pointPaymentClientGroupType }) => {
      switch (type) {
        case TransactionTypes.門診費用:
          return `$${amount}`;
        case TransactionTypes.團課券購買:
          return `${ticketGained} 張 / $${amount}`;
        case TransactionTypes.團課券退款:
          return `${ticketGained} 張 / $ -${amount}`;
        case TransactionTypes.堂數交易:
          return `${showDecimal(+paidPointGained + +giftPointGained)} ${pointUnit[pointPaymentClientGroupType as PointTypes]}/ $${amount}`;
        case TransactionTypes.堂數退款:
          return `${showDecimal(+paidPointGained + +giftPointGained)} ${pointUnit[pointPaymentClientGroupType as PointTypes]}/ $ -${amount}`;
        default:
          amount = 0;
      }
    },
  },
  {
    name: 'attachment',
    required: true,
    label: '收據',
    align: 'left',
    field: row => row.id,
  },
  {
    name: 'detail',
    required: true,
    label: '明細',
    align: 'left',
    field: row => row,
  },
];

// receipt
const receiptData = ref<ReceiptData>([]);
const isReceiptDialogOpen = ref(false);
const space = ref('');

async function checkReceipt(paymentId: number) {
  const data = await getClientPaymentDetail({ clientId: +props.clientId, paymentId });
  const { type, client, date, userShift, clientSchedulePaymentMultiChannelPay, groupClassTicketPaymentMultiChannelPay, pointPaymentMultiChannelPay, paidPointGained, giftPointGained, groupClassName, pointPaymentPlan, pointPaymentClientGroupName, ticketGained, spaceName, pointPaymentClientGroupType } = data;
  space.value = spaceName!;
  let amount = 0;
  let extraFields: InstanceType<typeof Receipt>['$props']['rows'] = [];
  switch (type) {
    case TransactionTypes.門診費用:{
      const addOnList = data.addOnServices.filter(a => a.isAddOn);
      amount = calcReceiptAmount(clientSchedulePaymentMultiChannelPay);
      extraFields = [
        { name: 'amount', label: '總額', value: `$${amount}` },
        { name: 'declaration', label: '健保申報', value: '無' },
        { name: 'selfPay', label: '自費項目', value: userShift?.type ? ShiftType[userShift.type] : '-' },
        { name: 'userName', label: '治療師', value: userShift?.user?.name },
        { name: 'date', label: '日期', value: date },
        ...(!!userShift && userShift.type === ShiftType['震波'] ? [{ name: 'independentShockWaveShots', label: '發數', value: `${data?.record?.independentShockWaveShots ?? 0}發` }] : []),
        ...addOnList.length > 0 ? [{ name: 'addOn', label: '加購服務', value: addOnList.map(a => a.serviceName).join('、') }] : [],
        ...addOnList.some(addOn => addOn.serviceType === AddOnServiceTypes['震波']) ? [{ name: 'addOn', label: '加購發數', value: `${data?.record?.addOnServiceShockWaveShots ?? 0}發` }] : [],
      ];
    }
      break;
    case TransactionTypes.團課券購買:
      amount = calcReceiptAmount(groupClassTicketPaymentMultiChannelPay);
      extraFields = [{ name: 'groupClassName', label: '課程名稱', value: groupClassName }, { name: 'amount', label: '金額', value: `$${amount}` }, { name: 'pointGained', label: '張數', value: `${ticketGained ?? 0}張` }];
      break;
    case TransactionTypes.團課券退款:
      amount = calcReceiptAmount(groupClassTicketPaymentMultiChannelPay);
      extraFields = [{ name: 'groupClassName', label: '課程名稱', value: groupClassName }, { name: 'amount', label: '金額', value: `-$${amount}` }, { name: 'pointGained', label: '張數', value: `${ticketGained ?? 0}張` }];
      break;
    case TransactionTypes.堂數交易:
      amount = calcReceiptAmount(pointPaymentMultiChannelPay);
      extraFields = [{ name: 'group', label: '群組', value: pointPaymentClientGroupName }, { name: 'amount', label: '金額', value: `$${amount}` }, { name: 'planName', label: '方案', value: pointPaymentPlan }, { name: 'pointGained', label: `取得${pointUnit[pointPaymentClientGroupType]}數`, value: `${paidPointGained}${pointUnit[pointPaymentClientGroupType]}` }, { name: 'giftPointGained', label: `贈送${pointUnit[pointPaymentClientGroupType]}數`, value: `${giftPointGained}${pointUnit[pointPaymentClientGroupType]}` }];
      break;
    case TransactionTypes.堂數退款:
      amount = calcReceiptAmount(pointPaymentMultiChannelPay);
      extraFields = [{ name: 'group', label: '群組', value: pointPaymentClientGroupName }, { name: 'amount', label: '金額', value: `-$${amount}` }, { name: 'planName', label: '方案', value: pointPaymentPlan }, { name: 'pointGained', label: `${pointUnit[pointPaymentClientGroupType]}數`, value: `${showDecimal(+paidPointGained + +giftPointGained)}${pointUnit[pointPaymentClientGroupType]}` }];
      break;
    default:
      amount = 0;
  }

  receiptData.value = [
    { name: 'name', label: '姓名', value: client?.name },
    { name: 'gender', label: '性別', value: client?.gender },
    { name: 'id', label: '身分證字號', value: client?.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client?.birthDate },
    ...extraFields,
  ];

  isReceiptDialogOpen.value = true;
}

const targetPaymentDetails = ref<InstanceType<typeof PaymentDetail>['$props']['detail']>({} as any);
const showDetail = ref(false);

async function checkPaymentDetail(val: any) {
  targetPaymentDetails.value = val;
  const data = await getClientPaymentDetail({ clientId: +props.clientId, paymentId: val.id });
  targetPaymentDetails.value = { ...targetPaymentDetails.value, ...data, clientName: data.client?.name };
  showDetail.value = true;
}
</script>

<template>
  <div>
    <QTable :columns="cols" :rows="rows" row-key="id" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-attachment="{ value }">
        <QTd class="text-center">
          <QBtn v-if="!!value" flat round icon="o_receipt_long" @click="checkReceipt(value)" />
          <span v-else>-</span>
        </QTd>
      </template>
      <template #body-cell-detail="{ value }">
        <QTd>
          <QBtn v-if="!!value" flat round icon="o_article" @click="checkPaymentDetail(value)" />
          <span v-else>-</span>
        </QTd>
      </template>
    </QTable>
  </div>
  <QDialog v-model="isReceiptDialogOpen">
    <Receipt :rows="receiptData" :space-name="space" :space-id="Space[space as keyof typeof Space]" hide-checkout payment-method="現金" />
  </QDialog>
  <QDialog v-model="showDetail">
    <PaymentDetail :detail="targetPaymentDetails" />
  </QDialog>
</template>
