<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';
import { type ClientContract, getAllContract } from '@/api';

const props = defineProps<{
  clientId: string;
}>();

const rows = ref<ClientContract[]>([]);
rows.value = await getAllContract(+props.clientId);

const cols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    style: 'width:150px',
    field: row => row.date,
  },
  {
    name: 'contractUrl',
    required: true,
    label: '合約書',
    align: 'left',
    field: row => row.task_id,
  },

];

function getContract() {
  console.log('getContract');
}
</script>

<template>
  <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
    <template #body-cell-contractUrl>
      <td class="flex items-center cursor-pointer" @click="getContract">
        <span class="q-mr-sm filename">堂數儲值合約書 N 12345.pdf</span>
        <QIcon name="o_attach_file" size="sm" />
      </td>
    </template>
  </QTable>
</template>

<style lang="scss" scoped>
.filename {
  text-decoration: underline;
}
</style>
