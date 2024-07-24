<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';
import { type Voucher, getClientVouchers } from '@/api';

// import { PaymentTypes, TransactionTypes } from '@/const/general';

const props = defineProps<{
  clientId: string;
}>();

const rows = ref<Voucher[]>([]);
rows.value = await getClientVouchers(+props.clientId);

const cols: QTableProps['columns'] = [
  {
    name: 'space',
    required: true,
    label: '場館',
    align: 'left',
    field: row => row.space.name,
  },
  {
    name: 'name',
    required: true,
    label: '團課名稱',
    align: 'left',
    field: row => row.name,
  },
  {
    name: 'useAbleGroupClassTickets',
    label: '張數',
    align: 'left',
    field: row => `${row.useAbleGroupClassTickets ?? 0} 張`,
  },
  // {
  //   name: 'actions',
  //   label: '',
  //   align: 'left',
  //   field: () => {},
  // },
];
</script>

<template>
  <div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-actions>
        <QTd>
          <!-- <QBtn flat round icon="o_description" @click="checkReceipt" /> 收據 icon -->
          <!-- <QBtn flat round icon="compare_arrows" /> 移轉 icon -->
        </QTd>
      </template>
    </QTable>
  </div>
</template>
