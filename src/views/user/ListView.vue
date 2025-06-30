<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import type { QTableProps } from 'quasar';
import { useUserStore } from '@/stores';
import { computed, ref } from 'vue';
import { PTLevel } from '@/api';
import { getUserAccountState } from '@/utils/mappers';

const { currentRoute } = useLayoutRoute();
const userStore = useUserStore();
await userStore.getUsers();

const jobTitleFilter = ref(userStore.userJobTitleOptions.map(item => item.value));

const cols: QTableProps['columns'] = [
  { name: 'state', label: '狀態', field: 'state', align: 'left', headerStyle: 'width: 100px', format: (val, row) =>
    getUserAccountState({ stateOfWork: row.stateOfWork, state: val }) },
  { name: 'name', label: '姓名', field: 'name', align: 'left' },
  { name: 'hireDate', label: '到職日期', field: 'hireDate', align: 'left' },
  { name: 'jobTitle', label: '職稱', field: 'jobTitle', align: 'left' },
  { name: 'PTLevel', label: '職階', field: 'PTLevel', align: 'left', format: val => PTLevel[val] },
  { name: 'spaces', label: '場館', field: 'spaces', align: 'left', style: 'text-wrap:wrap; word-break: break-all' },
  { name: 'email', label: '帳號', field: 'email', align: 'left' },
  { name: 'edit', label: '', field: 'edit', align: 'left', style: 'width:50px' },
];
const rows = computed(() => userStore.users
  .filter(user => jobTitleFilter.value.includes(user?.role?.id))
  .map(user => ({
    ...user,
    jobTitle: user?.role?.name,
    spaces: user.spaces.map(space => space.name).join(),
  })));
</script>

<template>
  <main class="q-py-sm">
    <div v-if="currentRoute === 'userList'" class="staff-list">
      <h3 class="text-headline-small">人員總表</h3>
      <div class="staff-list__header">
        <MultiOptionSelect v-model="jobTitleFilter" :options="userStore.userJobTitleOptions" label="職稱" style="width: 144px;" />
      </div>
      <div class="staff-list__body">
        <QTable :columns="cols" :rows="rows" row-key="name" bordered hide-pagination class="no-shadow" :rows-per-page-options="[0]">
          <template #body-cell-state="{ value }">
            <QTd>
              <QChip square :class="value.color" class="" dense size="md">
                <div class="text-label-small flex justify-center" style="width:34px">{{ value.label }}</div>
              </QChip>
            </QTd>
          </template>
          <template #body-cell-email="{ row }">
            <QTd>
              <div class="row justify-between items-center">
                <p>{{ row.email }}</p>
              </div>
            </QTd>
          </template>
          <template #body-cell-edit="{ row }">
            <QTd>
              <div class="row justify-between items-center">
                <QBtn icon="o_edit" flat round @click="() => $router.push({ name: 'userEdition', query: { userId: row.id } })" />
              </div>
            </QTd>
          </template>
        </QTable>
      </div>
    </div>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.staff-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__header {
    max-width: 164px;
  }
}

// .state {
//   display: block;
//   width: 10px;
//   height: 10px;
//   border-radius: 50%;
//   background-color: #e86969;
//   margin-right: 8px;
//   &--active {
//     background-color: #91d0c1;
//   }
//   &--banned {
//     background-color: #f0a754;
//   }
//   &--resigned {
//     background-color: #b3b3b3;
//   }
// }

:deep(th) {
  font-size: 16px;
  vertical-align: middle;
}

:deep(td) {
  font-size: 16px !important;
}
</style>
