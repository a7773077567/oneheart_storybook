<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useClientStore } from '@/stores';
import type { QTableProps } from 'quasar';
import AddAssociation from '@/components/client/AddAssociation.vue';

const props = defineProps<{ clientId: string }>();

const clientStore = useClientStore();
await clientStore.getClientInfo(+props.clientId);

const rows = computed(() => clientStore.targetClient?.associations ?? []);
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

const showAdd = ref(false);
</script>

<template>
  <div>
    <div class="q-mb-md text-right">
      <QBtn icon="o_add" label="新增常用人員" outline @click="showAdd = true" />
    </div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered @row-click="(_, row) => $router.push({ name: 'clientInfo', params: { clientId: row.id } })" />
    <QDialog v-model="showAdd" class="add_association_dialog" persistent transition-show="scale" transition-hide="scale">
      <AddAssociation :client-id="+clientId" @cancel="showAdd = false" @submit="clientStore.getClientInfo(+props.clientId)" />
    </QDialog>
  </div>
</template>

<style lang="scss">

</style>
