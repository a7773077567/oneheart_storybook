<script setup lang="ts">
import { OInput } from '@/components/shared';
import { ref } from 'vue';
import { type Client, fetchClients } from '@/api';
import { QPagination, type QTableProps } from 'quasar';
import { useLayoutRoute } from '@/composables/layoutRoute';

const { currentRoute } = useLayoutRoute();
const search = ref('');
const rows = ref<Client[]>([]);
const paging = ref<QPagination['$props']>({
  max: 5,
  modelValue: 1,
});

const cols: QTableProps['columns'] = [
  {
    name: 'id',
    required: true,
    label: '會員編號',
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
];

await getData();
async function getData(query = {}) {
  const { meta, data } = await fetchClients(query);
  // paging.value = { max: meta?.pageCount ?? 1, modelValue: meta?.page ?? 1 }
  paging.value = { max: meta?.pageCount ?? 1, modelValue: meta?.page ?? 1 } as QPagination['$props'];
  rows.value = data;
}

function handleSearch() {
  getData({ ...(search.value && { nameOrPhone: search.value }) });
}

function handlePageChange(page: number) {
  getData({ page });
}
</script>

<template>
  <div v-if="currentRoute === 'clientList'">
    <section class="q-mb-md flex">
      <div class="flex">
        <OInput v-model="search" placeholder="輸入客戶名稱或電話" hide-bottom-space class="q-mr-md" clearable />
        <QBtn icon="search" size="14px" outline class="cursor-pointer q-px-md" label="搜尋" @click="handleSearch" @keyup:enter="handleSearch" />
      </div>
      <div class="flex flex-center q-ml-auto">
        <QPagination
          v-model="paging.modelValue"
          :max="paging.max"
          input
          @update:model-value="handlePageChange"
        />
      </div>
    </section>

    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered @row-click="(_, row) => $router.push({ name: 'clientInfo', params: { clientId: row.id } })" />
  </div>
  <RouterView />
</template>

<style scoped lang="scss">
.client_list :deep(.q-table) {
  tr {
    cursor: pointer;
  }
}
</style>
