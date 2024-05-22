<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useClientStore } from '@/stores';
import type { QTableProps } from 'quasar';

const props = defineProps<{ clientId: string }>();

const clientStore = useClientStore();
await clientStore.getClientInfo(props.clientId);

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
      <QCard>
        <QCardSection class="text-center add_association_dialog__header">
          新增常用人員
        </QCardSection>
        <QCardSection>
          <form class="add_association_dialog__content row q-col-gutter-md" @submit.prevent>
            <fieldset class="col-6 col-md-4">
              <span class="label">姓名</span>
              <OInput hide-bottom-space />
            </fieldset>
            <fieldset class="col-6 col-md-4">
              <span class="label">電話</span>
              <OInput hide-bottom-space />
            </fieldset>
            <fieldset class="col-6 col-md-4">
              <span class="label">暱稱</span>
              <OInput hide-bottom-space />
            </fieldset>
            <fieldset class="col-6 col-md-12">
              <span class="label">生日</span>
              <OInput hide-bottom-space />
            </fieldset>
            <fieldset class="col-6 col-md-12">
              <span class="label">地址</span>
              <OInput hide-bottom-space />
            </fieldset>
          </form>
        </QCardSection>
        <QCardActions vertical class="q-pa-lg add_association_dialog__actions">
          <QBtn label="確定" color="black" />
          <QBtn label="取消" @click="showAdd = false" />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
</template>

<style lang="scss">
.add_association_dialog {
  &__header {
    font-weight: 600;
  }
  &__content {
    fieldset {
      display: flex;
      align-items: center;
      > .label {
        width: 50px;
        flex: 0 0 auto;
      }
      > .q-field {
        flex: 1;
      }
    }
  }
  &__actions {
    gap: 8px;
  }
}
</style>
