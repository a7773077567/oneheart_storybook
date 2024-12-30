<script setup lang='ts'>
import { computed } from 'vue';
import type { QTableProps } from 'quasar';
import { PointTypes } from '@/const/general';
import type { PointsGroup } from '@/api';
import { showDecimal } from '@/utils/helpers';

defineProps<{
  groupList: PointsGroup[];
}>();

defineEmits<{
  (e: 'edit', groupId: PointsGroup): void;
  (e: 'delete', groupId: number): void;
}>();

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
</script>

<template>
  <QList class="rounded-borders points_group_list">
    <template v-if="groupList.length > 0">
      <QExpansionItem v-for="group in groupList" :key="group.id" switch-toggle-side class="q-my-sm" dense-toggle expand-icon-class="toggle_avatar">
        <template #header>
          <QItemSection class="points_group_list__header">
            <div class="group_title">
              <span>{{ PointTypes[group.type] }}</span>
              <div class="group_title_name">
                {{ group.name }}
              </div>
              <span class="q-ml-md"> {{ group.type === PointTypes['震波'] ? '發數' : '堂數' }}</span>
              <div class="group_title_points">
                {{ showDecimal(group.points) ?? 0 }}
              </div>
              <span>{{ group.type === PointTypes['震波'] ? '發' : '堂' }}</span>
            </div>
          </QItemSection>
          <QItemSection side>
            <div class="row items-center">
              <QBtn round flat icon="o_edit" size="sm" color="black" @click.stop="$emit('edit', group)" />
              <QBtn round flat icon="o_delete" size="sm" color="black" @click.stop="$emit('delete', group.id)" />
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
