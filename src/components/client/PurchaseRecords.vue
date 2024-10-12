<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';
import { type PurchaseRecord, getClientPayments } from '@/api';
import { PaymentTypes, TransactionTypes } from '@/const/general';

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
    label: '金額/堂數',
    align: 'left',
    field: (row) => {
      switch (row.type) {
        case TransactionTypes.門診費用:
          return row.payMethod === PaymentTypes.堂數 ? row.usedPoint : row.amount;
        case TransactionTypes.團課券購買:
          return '-';

        case TransactionTypes.堂數交易:
        default:
          return row.amount;
      }
    },
  },
];
</script>

<template>
  <div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered />
  </div>
</template>
