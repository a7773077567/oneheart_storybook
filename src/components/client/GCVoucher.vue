<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

import { PaymentTypes, TransactionTypes } from '@/const/general';

defineProps<{
  clientId: string;
}>();

const rows = ref<any[]>([{
  date: '2024/07/08',
  spaceName: '台北運動場館',
  counts: 10,
  amount: 20000,
  classId: 0,
}]);
// await getMyVouchers(+props.clientId);

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
    name: 'classId',
    required: true,
    label: '團課名稱',
    align: 'left',
    field: () => '瑜伽課', // 需要 mapping
  },
  {
    name: 'amount',
    required: true,
    label: '金額/點數',
    align: 'left',
    field: (row) => {
      return row.amount;
    },
  },
  {
    name: 'usedGroupClassTicket',
    label: '張數',
    align: 'left',
    field: row => row.counts,
  },
  {
    name: 'actions',
    label: '',
    align: 'left',
    field: () => {},
  },
];

function checkReceipt() {}
</script>

<template>
  <div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-actions>
        <QTd>
          <QBtn flat round icon="o_description" @click="checkReceipt" />
          <QBtn flat round icon="compare_arrows" />
        </QTd>
      </template>
    </QTable>
  </div>
</template>
