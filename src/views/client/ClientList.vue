<script setup lang="ts">
import { OInput, OSearch } from '@/components/shared';
import { ref } from 'vue';
import { type Client, fetchClients } from '@/api';
import type { QPagination, QTableProps } from 'quasar';
import { useLayoutRoute } from '@/composables/layoutRoute';

const { currentRoute } = useLayoutRoute();
const search = ref('');
const rows = ref<Client[]>([]);
const paging = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

const cols: QTableProps['columns'] = [
  {
    name: 'id',
    required: true,
    label: '客戶編號',
    align: 'left',
    style: 'width:1px',
    field: row => row.id,
  },
  {
    name: 'name',
    required: true,
    label: '姓名',
    align: 'left',
    field: row => row.name,
  },
  {
    name: 'phone',
    required: true,
    label: '電話',
    align: 'left',
    field: row => row.phone,
  },
  {
    name: 'note',
    required: true,
    label: '備註',
    align: 'left',
    field: row => row.note,
  },
  {
    name: 'action',
    required: true,
    label: '',
    align: 'left',
    field: row => row.id,
  },
];

await getList();
async function getList(query = {}) {
  const { meta, data } = await fetchClients(query);
  paging.value.page = meta?.page ?? 1;
  paging.value.rowsNumber = meta?.itemCount ?? 1;
  rows.value = data;
}

function handleSearch(val: string) {
  getList({ page: 1, ...(!!val && { nameOrPhone: val }) });
}

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  paging.value.page = page;
  paging.value.rowsPerPage = rowsPerPage;
  getList({ page, take: rowsPerPage, ...(!!search.value && { nameOrPhone: search.value }) });
};
</script>

<template>
  <div v-if="currentRoute === 'clientList'" class="client_list">
    <div class="q-my-md">
      <OSearch v-model="search" @search="handleSearch" />
    </div>
    <QTable
      v-model:pagination="paging" :columns="cols" :rows="rows" row-key="id"
      class="no-shadow client_list" :rows-per-page-options="[1, 10, 20, 50]"
      @request="onRequest"
      @row-click="(_: any, row: any) => $router.push({ name: 'clientInfo', params: { clientId: row.id } })"
    >
      <template #body-cell-action>
        <QTd><QIcon name="o_chevron_right" size="sm" /></QTd>
      </template>
      <template #no-data>
        <QTd>
          <p>沒有符合的搜尋結果</p>
          <p>請替換搜尋條件後再重試查詢</p>
        </QTd>
      </template>
    </QTable>
  </div>
  <RouterView />
</template>

<style scoped lang="scss">
.client_list {
  overflow: auto;
  :deep(.q-table) {
    tr {
      cursor: pointer;
    }
  }
}
</style>
