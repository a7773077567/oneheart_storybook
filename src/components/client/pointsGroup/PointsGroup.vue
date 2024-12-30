<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useDialog } from '@/composables/dialog';
import PointsGroupForm from '@/components/client/pointsGroup/PointsGroupForm.vue';
import { pointsGroupOptions } from '@/const/general';
import { type CreateGroupField, type EditGroupField, type PointsGroup, createPointGroup, deletePointGroup, getClientPointGroup, updatePointGroup } from '@/api';
import { useQuasar } from 'quasar';
import { useClientStore } from '@/stores';
import GroupList from './GroupList.vue';

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
  const { onOk } = await useDialog({ type: 'confirm', title: '確定刪除此群組', message: '一但刪除群組，則無法復原，如確認無誤請按確定。' });
  onOk(async () => {
    await deletePointGroup(delGroupId);
    getGroupList();
  });
}

const $q = useQuasar();
async function createGroup(value: CreateGroupField) {
  await createPointGroup(value);
  $q.notify({ message: '群組創建成功', timeout: 200, position: 'top' });
  showGroupForm.value = false;
  getGroupList();
}

// edit
function handleEditClick(group: PointsGroup) {
  showGroupForm.value = true;
  groupFormType.value = 'edit';
  targetGroup.value = group;
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
        style="min-width: 150px;"
      />
      <QBtn outline icon="o_add" class="q-ml-auto" @click="clickCreateBtn">
        新增群組
      </QBtn>
    </div>
    <GroupList :group-list="displayGroupList" @edit="handleEditClick" @delete="deleteGroup" />
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
