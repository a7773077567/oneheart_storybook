<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import type { QTableProps } from 'quasar';
import { useUserStore } from '@/stores';
import { computed, ref } from 'vue';
import { AccountState, PTLevel, WorkState } from '@/api';

const { currentRoute } = useLayoutRoute();
const userStore = useUserStore();
await userStore.getUsers();

const jobTitleFilter = ref(userStore.userJobTitleOptions.map(item => item.value));

const cols: QTableProps['columns'] = [
  { name: 'state', label: '狀態', field: 'state', align: 'left', headerStyle: 'width: 100px' },
  { name: 'name', label: '姓名', field: 'name', align: 'left' },
  { name: 'hireDate', label: '到職日期', field: 'hireDate', align: 'left' },
  { name: 'jobTitle', label: '職稱', field: 'jobTitle', align: 'left' },
  { name: 'PTLevel', label: '職階', field: 'PTLevel', align: 'left', format: val => PTLevel[val] },
  { name: 'spaces', label: '場館', field: 'spaces', align: 'left', style: 'text-wrap:wrap; word-break: break-all' },
  { name: 'email', label: '帳號', field: 'email', align: 'left' },
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
      <div class="staff-list__header">
        <QSelect v-model="jobTitleFilter" :options="userStore.userJobTitleOptions" label="全部人員" outlined color="#515050" dense multiple emit-value map-options />
      </div>
      <div class="staff-list__body">
        <QTable :columns="cols" :rows="rows" row-key="name" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
          <template #body-cell-state="{ row }">
            <QTd>
              <div class="row items-center">
                <template v-if="row.stateOfWork === WorkState['在職']">
                  <span class="state" :class="{ 'state--active': row.state === AccountState['開通'] }" />
                  <span>{{ AccountState[row.state] }}</span>
                </template>
                <template v-else>
                  <span class="state" :class="row.stateOfWork === WorkState['停權'] ? 'state--banned' : 'state--resigned'" />
                  <span>{{ WorkState[row.stateOfWork] }}</span>
                </template>
              </div>
            </QTd>
          </template>
          <template #body-cell-email="{ row }">
            <QTd>
              <div class="row justify-between items-center">
                <p>{{ row.email }}</p>
                <div class="row q-gutter-sm flex-center">
                  <QBtn icon="o_edit" flat round @click="() => $router.push({ name: 'userEdition', query: { userId: row.id } })" />
                </div>
              </div>
            </QTd>
          </template>

          <!-- <template #body="props">
            <QTr :props="props">
              <QTd key="state" :props="props" auto-width>
                <div class="row items-center full-width">
                  <template v-if="props.row.stateOfWork === WorkState['在職']">
                    <span class="state" :class="{ 'state--active': props.row.state === AccountState['開通'] }" />
                    <span>{{ AccountState[props.row.state] }}</span>
                  </template>
                  <template v-else>
                    <span class="state" :class="props.row.stateOfWork === WorkState['停權'] ? 'state--banned' : 'state--resigned'" />
                    <span>{{ WorkState[props.row.stateOfWork] }}</span>
                  </template>
                </div>
              </QTd>
              <QTd key="name" :props="props">
                {{ props.row.name }}
              </QTd>
              <QTd key="jobTitle" :props="props">
                {{ props.row.jobTitle }}
              </QTd>
              <QTd key="spaces" :props="props">
                {{ props.row.spaces }}
              </QTd>
              <QTd key="email" :props="props">
                <div class="row justify-between items-center">
                  <p>{{ props.row.email }}</p>
                  <div class="row q-gutter-sm flex-center">
                    <QBtn icon="o_edit" flat round @click="() => $router.push({ name: 'userEdition', query: { userId: props.row.id } })" />
                  </div>
                </div>
              </QTd>
            </QTr>
          </template> -->
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

.state {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e86969;
  margin-right: 8px;
  &--active {
    background-color: #91d0c1;
  }
  &--banned {
    background-color: #f0a754;
  }
  &--resigned {
    background-color: #b3b3b3;
  }
}

:deep(th) {
  font-size: 16px;
  vertical-align: middle;
}

:deep(td) {
  font-size: 16px !important;
}
</style>
