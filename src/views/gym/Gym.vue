<script setup lang="ts">
import type { SpaceMonthlyConfig } from '@/api/spaceManagement';
import { BasicDialog, YearMonthSelect } from '@/components/shared';
import { useSpaceManagementStore } from '@/stores/spaceManagement';
import dayjs from 'dayjs';
import type { QTableColumn } from 'quasar';
import { computed, ref, watch } from 'vue';

const spaceManagementStore = useSpaceManagementStore();

const yearMonth = ref({
  year: dayjs().year(),
  month: dayjs().month(),
});
const editDialogOpened = ref(false);
const therapistNumber = ref(0);
const customerComplaintsAndRefundRate = ref(0);
const targetSpaceId = ref<null | number>(0);

const yearMonthQuery = computed(() => `${yearMonth.value.year}/${String(yearMonth.value.month + 1).padStart(2, '0')}`);

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
    name: 'edit',
    field: 'edit',
    label: '',
    align: 'right',
  },
];

function openEditDialog(row: SpaceMonthlyConfig) {
  therapistNumber.value = row.therapistNumber;
  customerComplaintsAndRefundRate.value = row.customerComplaintsAndRefundRate;
  targetSpaceId.value = row.id;

  editDialogOpened.value = true;
}

async function onConfirm() {
  ;

  await spaceManagementStore.updateSpaceMonthlyConfig(
    targetSpaceId.value!,
    {
      year: yearMonth.value.year,
      month: yearMonth.value.month,
      therapistNumber: +therapistNumber.value,
      customerComplaintsAndRefundRate: +customerComplaintsAndRefundRate.value,
    },
  );

  await spaceManagementStore.getSpaceMonthlyConfigList(yearMonthQuery.value);

  editDialogOpened.value = false;
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
      title="8 月場館設定"
      confirm-mode
      @confirm="onConfirm"
    >
      <div class="inputs">
        <BasicInput
          v-model="therapistNumber"
          label="場館治療師人數*"
          type="number"
          hide-bottom-space
        />
        <BasicInput
          v-model="customerComplaintsAndRefundRate"
          label="客訴與退款率*"
          type="number"
          hide-bottom-space
        />
      </div>
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
  gap: 32px;
}

:deep(th) {
  @include text-style($label-large, $on-surface);
}

:deep(td) {
  @include text-style($body-medium, $on-surface);
}
</style>
