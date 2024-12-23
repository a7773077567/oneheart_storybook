<script setup lang="ts">
import { DashboardBox } from '@/components/home/dashboard';
import { LineChart, OptionSelect, PieChart } from '@/components/shared';
import { RangeSelectOptions } from '@/const/dashboard';

defineProps<{
  modelValue: string;
  lineChartData: typeof LineChart['$props']['data'];
  pieChartData: typeof PieChart['$props']['data'];
}>();

defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();
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
          <PieChart v-bind="pieChartData" />
        </div>
      </div>
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
</style>
