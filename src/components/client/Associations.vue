<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useClientStore } from '@/stores';
import type { QTableProps } from 'quasar';
import AddAssociation from '@/components/client/AddAssociation.vue';
import EditAssociation from '@/components/client/EditAssociation.vue';
import { type ClientAssociation, deleteAssociation } from '@/api';
import { useQuasar } from 'quasar';

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
    field: row => row.relationTypeName ?? '-',
  },
  {
    name: 'action',
    label: '',
    align: 'right',
    field: row => row.id,
    style: 'width:150px',
  },
];

const showAdd = ref(false);
const showEdit = ref(false);

async function handleAdd() {
  showAdd.value = false;
  await clientStore.getClientInfo(+props.clientId);
}

async function handleEdit() {
  showEdit.value = false;
  await clientStore.getClientInfo(+props.clientId);
}

const targetAssociation = ref<ClientAssociation>({} as ClientAssociation);
async function editAssociation(info: ClientAssociation) {
  targetAssociation.value = info;
  showEdit.value = true;
}

// delete
const $q = useQuasar();
function deleteConfirm(id: number) {
  $q.dialog({
    title: '確定要移除常用人員嗎',
    message: '這個動作無法復原。常用人員的資料將被保留，但會移除與該客戶的常用關係。',
    ok: '確定刪除',
    cancel: '取消',
  }).onOk(async () => {
    try {
      await deleteAssociation({ clientId: +props.clientId, clientIdToBeDeleteAssociation: id });
      await clientStore.getClientInfo(+props.clientId);
      $q.notify({ message: '常用人員移除成功', timeout: 600, position: 'top' });
    }
    catch (err) {
      console.log(err);
    }
  });
}
</script>

<template>
  <div>
    <div class="q-mb-md text-right">
      <QBtn icon="o_add" label="新增常用人員" outline @click="showAdd = true" />
    </div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="horizontal" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered>
      <template #body-cell-action="{ row }">
        <QTd class="btns">
          <QBtn flat round icon="o_edit" @click="editAssociation(row)" />
          <QBtn flat round icon="o_delete" @click="deleteConfirm(row.id)" />
        </QTd>
      </template>
    </QTable>
    <QDialog v-model="showAdd" class="add_association_dialog" persistent transition-show="scale" transition-hide="scale">
      <AddAssociation :client-id="+clientId" @cancel="showAdd = false" @submit="handleAdd" />
    </QDialog>
    <QDialog v-model="showEdit" class="add_association_dialog" persistent transition-show="scale" transition-hide="scale">
      <EditAssociation :client-id="+clientId" :association-id="targetAssociation.id" :init-val="targetAssociation" @cancel="showEdit = false" @submit="handleEdit" />
    </QDialog>
  </div>
</template>

<style lang="scss">
.btns {
  text-align: right;
}
</style>
