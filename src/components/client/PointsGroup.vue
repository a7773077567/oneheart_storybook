<script setup lang='ts'>
import { computed, ref } from 'vue';
import type { QTableProps } from 'quasar';
import { useConfirm } from '@/composables/dialog';
import PointsGroupForm from '@/components/client/PointsGroupForm.vue';
import { pointsGroupOptions } from '@/const/general';

defineProps<{
  clientId: string;
}>();

const displayGroupType = ref(pointsGroupOptions);
const showGroupForm = ref(false);
const dialogType = ref<'add' | 'edit'>('add');

const groupList = computed(() => [
  {
    type: '物理治療',
    name: '群組A',
    id: 1,
    points: 10,
    members: [
      {
        id: 1,
        name: '王小明',
        isLeader: true,
      },
      {
        id: 2,
        name: '王大明',
        isLeader: false,
      },
      {
        id: 3,
        name: '王中明',
        isLeader: false,
      },
    ],
  },
  {
    type: '睡眠門診',
    name: '群組B',
    id: 2,
    points: 10,
    members: [
      {
        id: 1,
        name: '王小明',
        isLeader: true,
      },
      {
        id: 2,
        name: '王大明',
        isLeader: false,
      },
      {
        id: 3,
        name: '王中明',
        isLeader: false,
      },
    ],
  },
]);

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
    name: '群組稱號',
    required: true,
    label: '備註',
    align: 'left',
    field: row => row.note,
  },
];

async function deleteGroup() {
  const { onOk } = await useConfirm({ title: '確定刪除此群組', content: '一但刪除群組，則無法復原，如確認無誤請按確定。' });
  onOk(() => {
    console.log('fetch delete api');
  });
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
      />
      <QBtn outline icon="o_add" class="q-ml-auto" @click="(showGroupForm = true), (dialogType = 'add')">
        新增群組
      </QBtn>
    </div>
    <QList class="rounded-borders points_group_list">
      <QExpansionItem v-for="group in groupList" :key="group.id" switch-toggle-side class="q-my-sm" dense-toggle expand-icon-class="toggle_avatar">
        <template #header>
          <QItemSection class="points_group_list__header">
            <div class="group_title">
              <span>{{ group.type }}</span>
              <div class="group_title_name">
                {{ group.name }}
              </div>
              <span class="q-ml-md">點數</span>
              <div class="group_title_points">
                {{ group.points ?? 0 }}
              </div>
              <span>點</span>
            </div>
          </QItemSection>

          <QItemSection side>
            <div class="row items-center">
              <QBtn round flat icon="o_edit" size="sm" color="black" @click.stop="(showGroupForm = true), (dialogType = 'edit')" />
              <QBtn round flat icon="o_delete" size="sm" color="black" @click.stop="deleteGroup" />
            </div>
          </QItemSection>
        </template>

        <QCard>
          <QCardSection>
            <QTable :columns="cols" :rows="[]" row-key="id" separator="cell" hide-pagination class="no-shadow client_list" :rows-per-page-options="[0]" bordered />
          </QCardSection>
        </QCard>
      </QExpansionItem>
    </QList>
  </div>
  <PointsGroupForm v-model:state="showGroupForm" :type="dialogType" :initial-values="{}" />
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
