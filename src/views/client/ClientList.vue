<script setup>
import { OInput, OTable } from '@/components/shared';
import { ref } from 'vue';

const search = ref('');
const meta = ref({
  total: 5,
  current: 1,
});

const cols = [
  {
    name: 'id',
    required: true,
    label: '會員編號',
    align: 'left',
    field: row => row.id,
    style: 'width:1px',
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
</script>

<template>
  <div>
    <section class="q-mb-md flex">
      <div class="flex">
        <OInput v-model="search" placeholder="輸入客戶名稱或電話" hide-bottom-space class="q-mr-md" />
        <QBtn icon="search" size="14px" outline class="cursor-pointer q-px-md" label="搜尋" />
      </div>
      <div class="flex flex-center q-ml-auto">
        <QPagination
          v-model="meta.current"
          :max="meta.total"
          input
        />
      </div>
    </section>

    <QTable :columns="cols" :rows="[{ id: 1, name: 'test', phone: '12345678' }]" row-key="id" separator="cell" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered />
  </div>
</template>

<style scoped lang="scss">
.client_list :deep(.q-table) {
  th,
  td {
    font-size: 16px;
    vertical-align: middle;
  }
}
</style>
