<script setup lang='ts'>
import { computed, ref } from 'vue';
import type { QTableProps } from 'quasar';
import { useConfirm } from '@/composables/dialog';
import PointsGroupForm from '@/components/client/PointsGroupForm.vue';
import { PointTypes, pointsGroupOptions } from '@/const/general';
import { type CreateGroupField, type EditGroupField, type PointsGroup, createPointGroup, deletePointGroup, getClientPointGroup, updatePointGroup } from '@/api';
import { useQuasar } from 'quasar';
import { useClientStore } from '@/stores';

const props = defineProps<{
  clientId: string;
}>();

const clientStore = useClientStore();
const groupList = ref<PointsGroup[]>([]);
async function getGroupList() {
  groupList.value = await getClientPointGroup(+props.clientId);
}
getGroupList();

const targetGroup = ref<PointsGroup>({} as PointsGroup);
const emptyGroupInitVal = ref<Partial<PointsGroup>>({});

const displayGroupType = ref(pointsGroupOptions);
const displayGroupList = computed(() => {
  const filteredGroupType = displayGroupType.value.map(option => option.value);
  return groupList.value.filter(group => filteredGroupType.includes(group.type));
});

const showGroupForm = ref(false);
const groupFormType = ref<'add' | 'edit'>('add');

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
    name: 'remark',
    required: true,
    label: '備註',
    align: 'left',
    field: row => row.isAdmin ? '群長' : '',
  },
];

function clickCreateBtn() {
  showGroupForm.value = true;
  groupFormType.value = 'add';
  emptyGroupInitVal.value = {
    adminClient: {
      id: +props.clientId,
      name: clientStore.targetClient?.name ?? '',
      phone: clientStore.targetClient?.phone ?? '',
    },
  };
}

async function deleteGroup(delGroupId: number) {
  const { onOk } = await useConfirm({ title: '確定刪除此群組', content: '一但刪除群組，則無法復原，如確認無誤請按確定。' });
  onOk(async () => {
    await deletePointGroup(delGroupId);
    getGroupList();
  });
}

const $q = useQuasar();
async function createGroup(value: CreateGroupField) {
  await createPointGroup(value);
  $q.dialog({
    message: '群組創建成功',
  });
  showGroupForm.value = false;
  getGroupList();
}

async function editGroup(value: EditGroupField & { clientGroupId: number }) {
  const { clientGroupId, ...editVals } = value;
  showGroupForm.value = false;
  await updatePointGroup(clientGroupId, editVals);
  $q.dialog({
    message: '編輯成功',
  });
  getGroupList();
}
</script>

<template>
  <div class="points_group">
    <div class="points_group__control q-mb-md">
      <QSelect
        v-model="displayGroupType"
        :options="pointsGroupOptions"
        outline
        multiple
        label="顯示類別"
      />
      <QBtn outline icon="o_add" class="q-ml-auto" @click="clickCreateBtn">
        新增群組
      </QBtn>
    </div>
    <QList class="rounded-borders points_group_list">
      <template v-if="groupList.length > 0">
        <QExpansionItem v-for="group in displayGroupList" :key="group.id" switch-toggle-side class="q-my-sm" dense-toggle expand-icon-class="toggle_avatar">
          <template #header>
            <QItemSection class="points_group_list__header">
              <div class="group_title">
                <span>{{ PointTypes[group.type] }}</span>
                <div class="group_title_name">
                  {{ group.name }}
                </div>
                <span class="q-ml-md">堂數</span>
                <div class="group_title_points">
                  {{ group.points ?? 0 }}
                </div>
                <span>點</span>
              </div>
            </QItemSection>
            <QItemSection side>
              <div class="row items-center">
                <QBtn round flat icon="o_edit" size="sm" color="black" @click.stop="(showGroupForm = true), (groupFormType = 'edit'), (targetGroup = group)" />
                <QBtn round flat icon="o_delete" size="sm" color="black" @click.stop="deleteGroup(group.id)" />
              </div>
            </QItemSection>
          </template>
          <QCard>
            <QCardSection>
              <QTable :columns="cols" :rows="[{ ...group.adminClient, isAdmin: true }, ...group.memberClients]" row-key="id" separator="cell" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered />
            </QCardSection>
          </QCard>
        </QExpansionItem>
      </template>
      <div v-else class="text-center">
        無堂數群組
      </div>
    </QList>
  </div>
  <QDialog v-model="showGroupForm">
    <PointsGroupForm :type="groupFormType" :init-val="groupFormType === 'add' ? emptyGroupInitVal : targetGroup" @cancel="showGroupForm = false" @edit="editGroup" @create="createGroup" />
  </QDialog>
</template>

<style scoped lang="scss">
@mixin headerInput($size) {
  min-width: $size;
  background: white;
  border-radius: 16px;
  padding: 4px 12px;
  margin: 0 6px;
}

.points_group {
  &__control {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &_list {
    :deep(.q-expansion-item__container) {
      border: 1px solid black;
      .q-item {
        background: #e0e0e0;
      }
      .toggle_avatar {
        min-width: 28px;
      }
    }
    .group_title {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      &_name {
        @include headerInput(150px);
      }
      &_points {
        @include headerInput(24px);
      }
    }
  }
}
</style>
