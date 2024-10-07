<script setup lang='ts'>
import { ref } from 'vue';
import type { QTableProps } from 'quasar';
import { type ClientContract, ContractTypes, getAllContract } from '@/api';

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
    field: row => row.contractUrl,
  },

];

function getContract(link: string | null) {
  if (!link)
    return;
  window.open(link, '_blank');
}
</script>

<template>
  <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
    <template #body-cell-contractUrl="{ row: { contractUrl: value, contractType } }">
      <td class="flex items-center cursor-pointer" @click="getContract(value)">
        <span class="q-mr-sm filename">{{ ContractTypes[contractType] }}</span>
        <QIcon v-if="!!value" name="o_attach_file" size="sm" />
      </td>
    </template>
  </QTable>
</template>

<style lang="scss" scoped>
.filename {
  text-decoration: underline;
}
</style>
