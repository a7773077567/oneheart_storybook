<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

const rows = ref([{ id: 1, date: '2024/05/31', place: '台北館', item: '物理治療', payment: '現金', points: '2000元' }]);
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
    name: 'place',
    required: true,
    label: '場館',
    align: 'left',
    field: row => row.place,
  },
  {
    name: 'item',
    required: true,
    label: '項目',
    align: 'left',
    field: row => row.item,
  },
  {
    name: 'payment',
    required: true,
    label: '支付方式',
    align: 'left',
    field: row => row.payment,
  },
  {
    name: 'points',
    required: true,
    label: '金額/點數',
    align: 'left',
    field: row => row.points,
  },
];
</script>

<template>
  <div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered />
  </div>
</template>
