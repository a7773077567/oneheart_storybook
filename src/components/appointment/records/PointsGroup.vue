<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type ClientScheduleDetail, type CreateGroupField, type EditGroupField, type PointsGroup, createPointGroup, deletePointGroup, getClientPointGroup, updatePointGroup } from '@/api';
import { GroupList, PointsGroupForm } from '@/components/client';
import { pointsGroupOptions } from '@/const/general';
import { useQuasar } from 'quasar';
import { useDialog } from '@/composables/dialog';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const $q = useQuasar();
const pointsGroupList = ref<PointsGroup[]>([]);
getGroupList();
async function getGroupList() {
  pointsGroupList.value = await getClientPointGroup(props.scheduleDetail.clientId);
}

// filter
const filteredTypes = ref(pointsGroupOptions);
const displayGroupList = computed(() => {
  const filteredGroupType = filteredTypes.value.map(option => option.value);
  return pointsGroupList.value.filter(group => filteredGroupType.includes(group.type));
});

// add new group
const showGroupForm = ref(false);
const emptyGroupInitVal = ref<Partial<PointsGroup>>({});
const groupFormType = ref<'add' | 'edit'>('add');
function handleCreateClick() {
  showGroupForm.value = true;
  groupFormType.value = 'add';
  emptyGroupInitVal.value = {
    adminClient: {
      id: props.scheduleDetail.clientId,
      name: props.scheduleDetail.client.name ?? '',
      phone: props.scheduleDetail.client.phone ?? '',
    },
  };
}

async function createGroup(value: CreateGroupField) {
  await createPointGroup(value);
  $q.dialog({
    message: '群組創建成功',
  });
  showGroupForm.value = false;
  getGroupList();
}

// edit group
const targetGroup = ref<PointsGroup>({} as PointsGroup);
function handleEditClick(groupInfo: PointsGroup) {
  targetGroup.value = groupInfo;
  showGroupForm.value = true;
  groupFormType.value = 'edit';
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

// delete
async function deleteGroup(delGroupId: number) {
  const { onOk } = await useDialog({ type: 'confirm', title: '確定刪除此群組', message: '一但刪除群組，則無法復原，如確認無誤請按確定。' });
  onOk(async () => {
    await deletePointGroup(delGroupId);
    getGroupList();
  });
}
</script>

<template>
  <div>
    <div class="flex items-center space-between">
      <QSelect
        v-model="filteredTypes"
        style="min-width:150px"
        :options="pointsGroupOptions"
        outline
        multiple
        label="顯示類別"
      />
      <QBtn outline icon="o_add" class="q-ml-auto" @click="handleCreateClick">
        新增群組
      </QBtn>
    </div>
    <GroupList :group-list="displayGroupList" @edit="handleEditClick" @delete="deleteGroup" />
  </div>
  <QDialog v-model="showGroupForm">
    <PointsGroupForm :type="groupFormType" :init-val="groupFormType === 'add' ? emptyGroupInitVal : targetGroup" @cancel="showGroupForm = false" @edit="editGroup" @create="createGroup" />
  </QDialog>
</template>
