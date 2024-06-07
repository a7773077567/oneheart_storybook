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
    field: row => PaymentTypes[row.payMethod],
  },
  {
    name: 'amount',
    required: true,
    label: '金額/點數',
    align: 'left',
    field: (row) => {
      switch (row.type) {
        case TransactionTypes.門診費用:
        case TransactionTypes.商品購買:
          return row.payMethod === PaymentTypes.點數 ? row.usedPoint : row.amount;

        case TransactionTypes.點數交易:
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
