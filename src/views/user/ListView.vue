<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import type { QTableProps } from 'quasar';
import { useUserStore } from '@/stores';
import { computed } from 'vue';

enum State {
  '未開通' = 1,
  '開通' = 2,
}

const { currentRoute } = useLayoutRoute();
const userStore = useUserStore();
userStore.getUsers();

const cols: QTableProps['columns'] = [
  { name: 'state', label: '開通', field: 'state', align: 'left' },
  { name: 'name', label: '姓名', field: 'name', align: 'left' },
  { name: 'jobTitle', label: '職稱', field: 'jobTitle', align: 'left' },
  { name: 'spaces', label: '場館', field: 'spaces', align: 'left' },
  { name: 'email', label: '帳號', field: 'email', align: 'left' },
];
const rows = computed(() => userStore.users.map(user => ({
  state: user.state,
  name: user.name,
  jobTitle: user.role.name,
  spaces: user.spaces.map(space => space.name).join(),
  email: user.email,
  isSuspended: user.isSuspended,
})));
</script>

<template>
  <main class="q-py-sm">
    <div v-if="currentRoute === 'userList'" class="staff-list">
      <div class="staff-list__header" />
      <div class="staff-list__body">
        <QTable :columns="cols" :rows="rows" row-key="name" separator="cell" hide-pagination class="no-shadow" bordered>
          <template #body="props">
            <QTr :props="props">
              <QTd key="state" :props="props" auto-width>
                <div class="row flex-center">
                  <span class="state" :class="{ 'state--active': props.row.state === State['開通'] }" />
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
                    <span v-if="props.row.isSuspended" style="color: #E86969;">停權</span>
                    <QBtn icon="o_edit" flat round />
                  </div>
                </div>
              </QTd>
            </QTr>
          </template>
        </QTable>
      </div>
    </div>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.state {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e86969;
  &--active {
    background-color: #91d0c1;
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
