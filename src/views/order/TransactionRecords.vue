<script setup lang='ts'>
import { ref } from 'vue';
import { QPagination, type QTableProps } from 'quasar';
import { TransactionTypes } from '@/const/general';

const rows = ref();
const paging = ref<QPagination['$props']>({
  max: 1,
  modelValue: 1,
});

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
    name: 'id',
    required: true,
    label: '會員編號',
    align: 'left',
    field: row => row.id,
  },
  {
    name: 'type',
    required: true,
    label: '項目',
    align: 'left',
    field: row => TransactionTypes[row.type],
  },
  {
    name: 'name',
    required: true,
    label: '會員姓名',
    align: 'left',
    field: row => row.name,
  },
  {
    name: 'paymentMethod',
    required: true,
    label: '支付方式',
    align: 'left',
    field: row => row.paymentMethod,
  },
  {
    name: 'amount',
    required: true,
    label: '金額/點數',
    align: 'left',
    field: row => row.amount,
  },
  {
    name: 'attachment',
    required: true,
    label: '收據',
    align: 'left',
    field: row => row.attachment,
  },
];

async function getRecordList(page = 1) {
  console.log('fetch record list api', page);
  rows.value = [{ id: 1, date: '2024/05/31', type: 1, name: 'Sherry', place: '台北館', item: '物理治療', paymentMethod: '現金', amount: '2000元' }];
  paging.value = { max: 1, modelValue: 1 };
}

getRecordList();
</script>

<template>
  <div class="transaction_records_page">
    <div class="flex justify-end q-mb-md">
      <QPagination
        v-model="paging.modelValue"
        :max="paging.max"
        input
        @update:model-value="getRecordList"
      />
    </div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-attachment="{ value }">
        <QTd>
          <QBtn v-if="!!value" flat round icon="o_description" />
          <span v-else>-</span>
        </QTd>
      </template>
    </QTable>
  </div>
</template>
