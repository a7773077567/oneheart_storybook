<script setup lang="ts">
import { PieChart } from '@/components/shared';

type ChartData = InstanceType<typeof PieChart>['$props'];

defineProps<{
  caseStatus: ChartData;
  checkoutPlan: ChartData;
}>();
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <div class="title">治療師運營總覽</div>
    </div>
    <div class="overview__body">
      <div class="overview__chart">
        <div class="overview__duration-filter">本日</div>
        <div class="overview__chart-box">
          <PieChart
            :chart-data="caseStatus.chartData"
            :info-data="caseStatus.infoData"
            :info-caption="caseStatus.infoCaption"
            :title="caseStatus.title"
            :subtitle="caseStatus.subtitle"
          />
          <PieChart
            :chart-data="checkoutPlan.chartData"
            :info-data="checkoutPlan.infoData"
            :info-caption="checkoutPlan.infoCaption"
            :title="checkoutPlan.title"
            :subtitle="checkoutPlan.subtitle"
          />
        </div>
      </div>
      <div class="overview__signal" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview {
  width: 1084px;
  &__header {
    margin-bottom: 20px;
  }

  &__body {
    display: flex;
    background-color: #eff4fb;
    border-radius: 16px;
    border: 1px solid #dbdae7;
  }

  &__chart {
    border-right: 1px solid rgba(219, 218, 231, 1);
  }

  &__duration-filter {
    padding: 16px 16px 0 16px;
  }

  &__chart-box {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
}

.title {
  color: #1a1b21;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}
</style>
