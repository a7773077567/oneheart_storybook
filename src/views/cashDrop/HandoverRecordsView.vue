<script setup lang="ts">
import { HandoverDetailsDialog } from '@/components/cashDrop';
import type SimpleTable from '@/components/shared/SimpleTable.vue';
import { useHandoverStore } from '@/stores';
import type { QTableProps } from 'quasar';
import { computed, ref } from 'vue';

type SimpleTableRows = InstanceType<typeof SimpleTable>['$props']['rows'];

const handoverStore = useHandoverStore();
const { meta } = await handoverStore.getHandoverRecordList({
  order: 'DESC',
  page: 1,
  take: 10,
});
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: meta?.itemCount,
});

const columns: QTableProps['columns'] = [
  { name: 'date', field: 'date', label: '日期', align: 'left' },
  { name: 'time', field: 'time', label: '時間', align: 'left' },
  { name: 'userName', field: 'userName', label: '人員', align: 'left' },
  { name: 'dropAmount', field: 'dropAmount', label: '投庫總額', align: 'left' },
  { name: 'details', field: 'details', label: '明細', align: 'left', style: 'width: 40px' },
];

const isHandoverDetailsOpen = ref(false);

const transactionRows = computed<SimpleTableRows>(() => {
  const { handoverDetails } = handoverStore;
  if (!handoverDetails) {
    return [];
  }
  const { cashDrops, detailedExpenses } = handoverDetails;
  return [...cashDrops, ...detailedExpenses];
});

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  const { meta } = await handoverStore.getHandoverRecordList({
    order: 'DESC',
    page,
    take: rowsPerPage,
  });
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.rowsNumber = meta?.itemCount;
};

async function openDetailsDialog(cashDropId: number) {
  await handoverStore.getHandoverRecord(cashDropId);
  isHandoverDetailsOpen.value = true;
}
</script>

<template>
  <div class="handover-records">
    <QTable
      v-model:pagination="pagination"
      :columns="columns"
      :rows="handoverStore.cashDropRecordRows"
      row-key="id"
      bordered
      separator="cell"
      :rows-per-page-options="[10, 20, 50]"
      @request="onRequest"
    >
      <template #body-cell-details="props">
        <QTd :props="props">
          <QBtn icon="o_article" flat round @click="() => openDetailsDialog(props.row.id)" />
        </QTd>
      </template>
    </QTable>

    <HandoverDetailsDialog
      v-if="isHandoverDetailsOpen"
      v-model="isHandoverDetailsOpen"
      :overall-data="handoverStore.handoverDetails!.overall"
      :transaction-rows="transactionRows"
      :duration="handoverStore.handoverDetails!.duration"
    />
  </div>
</template>

<style lang="scss" scoped>
  .handover-records {
  margin-top: 15px;
}
</style>
