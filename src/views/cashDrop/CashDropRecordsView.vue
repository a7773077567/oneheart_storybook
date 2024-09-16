<script setup lang="ts">
import CashDropDetailsDialog from '@/components/cashDrop/CashDropDetailsDialog.vue';
import type { QTableProps } from 'quasar';
import { computed, ref } from 'vue';

const columns: QTableProps['columns'] = [
  { name: 'date', field: 'date', label: '日期', align: 'left', style: 'width: 123px' },
  { name: 'time', field: 'time', label: '時間', align: 'left', style: 'width: 80px' },
  { name: 'userName', field: 'userName', label: '人員', align: 'left', style: 'width: 123px' },
  { name: 'dropAmount', field: 'dropAmount', label: '金額', align: 'left' },
  { name: 'remainingCash', field: 'remainingCash', label: '剩餘現金', align: 'left' },
  { name: 'details', field: 'details', label: '明細', align: 'left', style: 'width: 52px' },
];

const rows = [
  { date: '123', time: '123', name: '123', userName: '123', dropAmount: 200, remainingCash: 200, details: '123' },
];

const isDetailsDialogOpen = ref(false);

// TODO temporarily
const cashDropDetails = computed(() => [
  { key: 'date', value: '123', span: true, custom: true },
  { key: 'account', value: '123', label: '人員' },
  { key: 'space', value: '123', label: '場館' },
  { key: 'cashDropAmount', value: 123, label: '投庫金額' },
  { key: 'remainCash', value: 0, label: '剩餘現金' },
]);
</script>

<template>
  <div class="cash-drop-records">
    <QTable :columns="columns" :rows bordered separator="cell" :rows-per-page-options="[0]">
      <template #body-cell-details="props">
        <QTd :props="props">
          <QBtn icon="o_article" flat round @click="isDetailsDialogOpen = true" />
        </QTd>
      </template>
    </QTable>

    <CashDropDetailsDialog v-model="isDetailsDialogOpen" mode="read" :details="cashDropDetails" />
  </div>
</template>

<style lang="scss" scoped>
  .cash-drop-records {
}
</style>
