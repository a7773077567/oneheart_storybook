<script setup lang="ts">
import { PieChart } from '@/components/shared';
import { DashboardBox } from '@/components/home/dashboard';
import { computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

type ChartData = InstanceType<typeof PieChart>['$props'];

defineProps<{
  therapistExecutionHours: ChartData;
  newAndReturnStatistic: ChartData;
  onetimeAndSessionsPurchase: ChartData;
  allPayments: ChartData;
}>();

dayjs.locale('zh-tw');

const title = computed(() => `本日營運狀況 ${dayjs().format('YYYY年M月D日（週dd）')}`);
</script>

<template>
  <DashboardBox :title="title" style="margin-top: 20px;">
    <template #body>
      <div class="dashboard">
        <PieChart
          v-bind="therapistExecutionHours"
        />
        <div />
        <PieChart
          v-bind="newAndReturnStatistic"
        />
        <QSeparator spaced="32px" class="separator" />
        <PieChart
          v-bind="onetimeAndSessionsPurchase"
        />
        <div />
        <PieChart
          v-bind="allPayments"
        />
      </div>
    </template>
  </DashboardBox>
</template>

<style lang="scss" scoped>
.dashboard {
  display: grid;
  grid-template-columns: auto 1fr auto;
}

.separator {
  grid-column: span 3;
}
</style>
