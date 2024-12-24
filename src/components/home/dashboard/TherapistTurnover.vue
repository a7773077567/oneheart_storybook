<script setup lang="ts">
import { DashboardBox } from '@/components/home/dashboard';
import { BasicDialog, LineChart, OptionSelect, PieChart } from '@/components/shared';
import { RangeSelectOptions } from '@/const/dashboard';
import type { QTableColumn, QTableProps } from 'quasar';
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: string;
  lineChartData: typeof LineChart['$props']['data'];
  pieChartData: typeof PieChart['$props']['data'];
  detailsData: any[];
  detailsPagination: QTableProps['pagination'];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'clickPie', val: string): void;
  (e: 'update:detailsPagination', val: QTableProps['pagination']): void;
  (e: 'request', val: Record<string, any>): void;
}>();

const isDetailsDialogOpen = ref(false);
const detailsPaginationModel = computed({
  get: () => props.detailsPagination,
  set: val => emit('update:detailsPagination', val),
});
const targetDetailsType = ref('');

const onClick: InstanceType<typeof PieChart>['$props']['onClick'] = (_, elements) => {
  const source = ['onetimePurchase', 'firstSessionPurchase', 'secondSessionPurchase'];
  const labels = ['單次消費交易列表', '初次堂數交易列表', '二次堂數交易列表'];
  targetDetailsType.value = labels[elements[0].index];
  emit('clickPie', source[elements[0].index]);
  isDetailsDialogOpen.value = true;
};

const columns: QTableColumn[] = [
  { name: 'clientName', field: 'clientName', label: '客戶', align: 'left', style: 'width: 200px' },
  { name: 'userShiftType', field: 'userShiftType', label: '科別', align: 'left', style: 'width: 220px' },
  { name: 'amount', field: 'amount', label: '金額', align: 'left' },
];
</script>

<template>
  <DashboardBox title="營業額總覽">
    <template #select>
      <OptionSelect :model-value="modelValue" :options="RangeSelectOptions" @update:model-value="$emit('update:modelValue', $event)" />
    </template>
    <template #body>
      <div class="body">
        <div class="body__line">
          <LineChart v-bind="lineChartData" />
        </div>
        <div class="body__pie">
          <PieChart
            v-bind="pieChartData"
            :on-click="onClick"
          />
        </div>
      </div>
      <BasicDialog
        v-if="isDetailsDialogOpen"
        v-model="isDetailsDialogOpen" :title="targetDetailsType"
      >
        <QTable
          v-model:pagination="detailsPaginationModel"
          flat
          :columns="columns"
          :rows="detailsData"
          class="table"
          @request="$emit('request', $event)"
        />
      </BasicDialog>
    </template>
  </DashboardBox>
</template>

<style lang="scss" scoped>
.body {
  display: flex;
  gap: 24px;

  &__line {
    width: 556px;
  }
}

.table {
  :deep(th) {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.1px;
  }

  :deep(td) {
    padding: 16px;
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }
}
</style>
