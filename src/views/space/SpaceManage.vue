<script setup lang="ts">
import { type SpaceMonthlyConfig, type UpdateSpaceMonthlyConfig, type User, fetchUsers } from '@/api';
import { BasicDialog, YearMonthSelect } from '@/components/shared';
import BasicSelect from '@/components/shared/BasicSelect.vue';
import { useNotify } from '@/composables/notify';
import { RoleType } from '@/const/user';
import { useSpaceManagementStore } from '@/stores/spaceManagement';
import dayjs from 'dayjs';
import type { QTableColumn } from 'quasar';
import { computed, ref, watch } from 'vue';

const spaceManagementStore = useSpaceManagementStore();

const yearMonth = ref({
  year: dayjs().year(),
  month: dayjs().month() + 1,
});
const editDialogOpened = ref(false);

const form = ref<Omit<UpdateSpaceMonthlyConfig, 'year' | 'month'>>({
  therapistNumber: 0,
  customerComplaintsAndRefundRate: 0,
  frontDeskFullTimeUserIds: [],
  frontDeskPartTimeStaffUserIds: [],
});
const targetSpace = ref<null | { name: string; id: number }>(null);

const yearMonthQuery = computed(() => `${yearMonth.value.year}/${String(yearMonth.value.month).padStart(2, '0')}`);

watch(
  yearMonthQuery,
  () => spaceManagementStore.getSpaceMonthlyConfigList(yearMonthQuery.value),
  { immediate: true },
);

const columns: QTableColumn[] = [
  {
    name: 'name',
    field: 'name',
    label: '場館名稱',
    align: 'left',
    style: 'width: 256px',
  },
  {
    name: 'therapistNumber',
    field: 'therapistNumber',
    label: '場館治療師人數',
    align: 'left',
    style: 'width: 148px',
  },
  {
    name: 'customerComplaintsAndRefundRate',
    field: 'customerComplaintsAndRefundRate',
    label: '客訴與退款率',
    align: 'left',
    style: 'width: 148px',
  },
  {
    name: 'frontDeskFullTimeUsers',
    field: 'frontDeskFullTimeUsers',
    label: '櫃檯正職人員',
    align: 'left',
    style: 'width: 152px; max-width: 152px; white-space: break-spaces',
    format: (val: User[]) => val.map(user => user.name).join(','),
  },
  {
    name: 'frontDeskPartTimeStaffUsers',
    field: 'frontDeskPartTimeStaffUsers',
    label: '櫃檯兼職人員',
    align: 'left',
    style: 'width: 152px; max-width: 152px; white-space: break-spaces',
    format: (val: User[]) => val.map(user => user.name).join(','),
  },
  {
    name: 'edit',
    field: 'edit',
    label: '',
    align: 'right',
  },
];

async function openEditDialog(row: SpaceMonthlyConfig) {
  const { therapistNumber, customerComplaintsAndRefundRate, frontDeskFullTimeUserIds, frontDeskPartTimeStaffUserIds } = row;

  form.value = {
    therapistNumber,
    customerComplaintsAndRefundRate,
    frontDeskFullTimeUserIds,
    frontDeskPartTimeStaffUserIds,
  };
  targetSpace.value = { name: row.name, id: row.id };
  editDialogOpened.value = true;

  getSpaceFrontDeskUsers(row.id);
}

async function onConfirm() {
  if (!targetSpace.value?.id)
    return useNotify('no space id');

  await spaceManagementStore.updateSpaceMonthlyConfig(
    targetSpace.value.id,
    {
      year: yearMonth.value.year,
      month: yearMonth.value.month + 1,
      therapistNumber: +form.value.therapistNumber,
      customerComplaintsAndRefundRate: +form.value.customerComplaintsAndRefundRate,
      frontDeskFullTimeUserIds: form.value.frontDeskFullTimeUserIds,
      frontDeskPartTimeStaffUserIds: form.value.frontDeskPartTimeStaffUserIds,
    },
  );

  useNotify('更新成功');

  await spaceManagementStore.getSpaceMonthlyConfigList(yearMonthQuery.value);

  editDialogOpened.value = false;
}

const frontDeskUsers = ref<{ label: string; value: number }[]>([]);
async function getSpaceFrontDeskUsers(spaceId: number) {
  const list = await fetchUsers({ spaceIds: [spaceId], roleTypes: [RoleType['櫃檯']] });
  frontDeskUsers.value = list.map(user => ({ label: user.name, value: user.id }));
}
</script>

<template>
  <div class="gym">
    <div class="gym__title">
      <div class="title">場館管理</div>
    </div>
    <div class="gym__select">
      <YearMonthSelect v-model="yearMonth" />
    </div>
    <div class="gym__body">
      <QTable
        row-key="name"
        :columns="columns"
        :rows="spaceManagementStore.spaceMonthlyConfigRows"
        flat
        :rows-per-page-options="[10, 20, 30, 50]"
      >
        <template #body-cell-edit="props">
          <QTd :props="props">
            <QIcon
              name="o_edit"
              style="cursor: pointer; padding: 8px"
              size="24px"
              @click="() => openEditDialog(props.row.raw)"
            />
          </QTd>
        </template>
      </QTable>
    </div>

    <BasicDialog
      v-if="editDialogOpened"
      v-model="editDialogOpened"
      title="場館設定"
      confirm-mode
      @confirm="onConfirm"
    >
      <div class="q-mb-md">
        <h3 class="text-title-small q-mb-2">{{ targetSpace?.name }}</h3>
        <h3 class="text-title-small">{{ yearMonth.year }}年 {{ yearMonth.month }}月</h3>
      </div>
      <form class="inputs" @submit.prevent>
        <BasicInput
          v-model="form.therapistNumber"
          label="場館治療師人數*"
          type="number"
          hide-bottom-space
        />
        <BasicInput
          v-model="form.customerComplaintsAndRefundRate"
          label="客訴與退款率*"
          type="number"
          hide-bottom-space
        />
        <BasicSelect v-model="form.frontDeskFullTimeUserIds" multiple emit-value map-options :options="frontDeskUsers" label="櫃檯正職人員" hide-bottom-space />
        <BasicSelect v-model="form.frontDeskPartTimeStaffUserIds" multiple emit-value map-options :options="frontDeskUsers" label="櫃檯兼職人員" hide-bottom-space />
      </form>
    </BasicDialog>
  </div>
</template>

<style lang="scss" scoped>
.gym {
  &__title {
    padding: 20px 0;
  }

  &__select {
    width: 320px;
    padding: 12px 0;
    box-sizing: content-box;
  }
}

.title {
  @include text-style($headline-small, $on-surface);
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(th) {
  @include text-style($label-large, $on-surface);
}

:deep(td) {
  @include text-style($body-medium, $on-surface);
}
</style>
