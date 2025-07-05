<script setup lang="ts">
import type { DetailParams, PaginationMeta } from '@/api/home/salaryReport/counter';
import { QTable } from 'quasar';
import type { QTableColumn, QTableProps } from 'quasar';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  title?: string;
  subTitle?: string;
  requestFunc: (params: DetailParams) => Promise<{ data: any[]; meta: PaginationMeta }>;
  columns: QTableColumn[];
  rows: QTableProps['rows'];
  yearMonth: string;
  userId: number;
  spaceId?: number;
}>();

const tableRef = ref<QTable | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const isLoading = ref(false);

const onRequest: QTableProps['onRequest'] = async ({ pagination: requestPagination }) => {
  const { page, rowsPerPage } = requestPagination;

  isLoading.value = true;
  const { meta } = await props.requestFunc({
    take: rowsPerPage,
    page,
    yearMonth: props.yearMonth,
    userId: props.userId,
    spaceId: props.spaceId!,
  });
  isLoading.value = false;

  const { page: newPage, take, itemCount } = meta;
  pagination.value.rowsNumber = itemCount;
  pagination.value.rowsPerPage = take;
  pagination.value.page = newPage;
};

onMounted(() => {
  tableRef.value?.requestServerInteraction();
});
</script>

<template>
  <div class="details">
    <div class="details__title">{{ title }}</div>
    <div class="details__title">{{ subTitle }}</div>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      :columns="columns"
      :rows="rows"
      flat
      row-key="id"
      :loading="isLoading"
      class="table"
      @request="onRequest"
    >
      <template #body-cell-btn="cellProps">
        <QTd :props="cellProps">
          <QBtn icon="chevron_right" flat @click="$router.push({ name: 'appointmentListInfo', params: { scheduleId: cellProps.row.userShiftId } })" />
        </QTd>
      </template>
    </QTable>
  </div>
</template>

<style lang="scss" scoped>
.details {
  min-height: 800px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__title {
    @include text-style($title-small, $on-surface);
  }
}

.table {
  :deep(th) {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.1px;
  }

  :deep(td) {
    padding: 10px 16px;
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }
}
</style>
