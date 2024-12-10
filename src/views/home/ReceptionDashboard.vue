<script setup lang="ts">
import { useReceptionStore } from '@/stores/home/dashboard/reception';
import { PieChart } from '@/components/shared';
import { DashboardBox } from '@/components/home/dashboard';
import { computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');
const receptionStore = useReceptionStore();
await receptionStore.getTodayBusinessStatus();

const title = computed(() => dayjs().format('YYYY年M月D日（週dd）'));
</script>

<template>
  <DashboardBox :title="title" style="margin-top: 20px;">
    <template #body>
      <div class="dashboard">
        <PieChart
          v-bind="receptionStore.therapistExecutionHoursStatistic"
        />
        <PieChart
          v-bind="receptionStore.newAndReturnStatistic"
        />
        <QSeparator spaced="32px" class="separator" />
        <PieChart
          v-bind="receptionStore.onetimeAndSessionsPurchaseStatistic"
        />
      </div>
    </template>
  </DashboardBox>
</template>

<style lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 64px;
}

.separator {
  grid-column: span 2;
}
</style>
