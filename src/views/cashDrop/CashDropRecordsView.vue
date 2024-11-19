<script setup lang="ts">
import CashDropDetailsDialog from '@/components/cashDrop/CashDropDetailsDialog.vue';
import { useCashDropStore } from '@/stores/cashDrop';
import type { QTableProps } from 'quasar';
import { ref } from 'vue';

const cashDropStore = useCashDropStore();
const { meta } = await cashDropStore.getCashDropRecords({
  order: 'DESC',
  page: 1,
  take: 10,
});
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: meta?.itemCount,
});

const tableRef = ref(null);

const columns: QTableProps['columns'] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'time', field: 'time', label: '時間', align: 'left' },
  { name: 'userName', field: 'userName', label: '人員', align: 'left' },
  { name: 'dropAmount', field: 'dropAmount', label: '金額', align: 'left' },
  { name: 'details', field: 'details', label: '明細', align: 'left', style: 'width: 40px' },
];

const isDetailsDialogOpen = ref(false);

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  const { meta } = await cashDropStore.getCashDropRecords({
    order: 'DESC',
    page,
    take: rowsPerPage,
  });
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.rowsNumber = meta?.itemCount;
};

async function openDetailsDialog(cashDropId: number) {
  await cashDropStore.getCashDrop(cashDropId);
  isDetailsDialogOpen.value = true;
}
</script>

<template>
  <div class="cash-drop-records">
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      :columns="columns"
      :rows="cashDropStore.cashDropRecordRows"
      row-key="id"
      bordered separator="cell"
      :rows-per-page-options="[10, 20, 50]"
      @request="onRequest"
    >
      <template #body-cell-details="props">
        <QTd :props="props">
          <QBtn icon="o_article" flat round @click="() => openDetailsDialog(props.row.id)" />
        </QTd>
      </template>
    </QTable>

    <CashDropDetailsDialog v-model="isDetailsDialogOpen" :details="cashDropStore.cashDropDetails" />
  </div>
</template>

<style lang="scss" scoped>
  .cash-drop-records {
  margin-top: 15px;
}
</style>
