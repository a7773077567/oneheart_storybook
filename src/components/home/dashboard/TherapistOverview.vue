<script setup lang="ts">
import { InfoCard, PieChart, SignalLight } from '@/components/shared';
import { EducationPointEdit } from '@/components/home/dashboard';
import { ref } from 'vue';

type ChartData = InstanceType<typeof PieChart>['$props'];

defineProps<{
  caseStatus: ChartData;
  checkoutPlan: ChartData;
}>();

const info = [
  {
    name: 'avgExecutionCount',
    label: '平均執行數',
    value: '1.25',
    caption: '治療師每日平均工作量',
  },
  {
    name: 'returnVisitRate',
    label: '回診率',
    value: '80%',
    caption: '初診客戶回診率',
  },
  {
    name: 'clientRate',
    label: '客戶率',
    value: '80%',
    caption: '初診客戶是否購買堂數',
  },
  {
    name: 'referralCount',
    label: '轉介數',
    value: '15',
    caption: '治療師受客戶轉介次數',
  },
  {
    name: 'educationPointsEntry',
    label: '教育積分填寫',
    value: {
      predicted: 30,
      current: 48,
    },
  },
];

const educationPoints = ref({
  predicted: info[4].value.predicted,
  current: info[4].value.current,
});
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <div class="title">治療師運營總覽</div>
    </div>
    <div class="overview__body">
      <div class="chart">
        <div class="chart__header">本日</div>
        <div class="chart__body">
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

      <div class="overview__body-separator" />

      <div class="info">
        <div class="info__header">
          header
        </div>
        <div class="info__body">
          <SignalLight :predicted="2" :current="0" />
          <InfoCard :data="info">
            <template #educationPointsEntry>
              <EducationPointEdit v-model="educationPoints" />
            </template>
          </InfoCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview {
  width: fit-content;
  &__header {
    margin-bottom: 20px;
  }

  &__body {
    display: flex;
    background-color: #eff4fb;
    border-radius: 16px;
    border: 1px solid #dbdae7;
  }

  &__body-separator {
    width: 1px;
    background-color: rgba(219, 218, 231, 1);
  }
}

.chart {
  &__header {
    padding: 16px 16px 0 16px;
  }

  &__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
}

.info {
  &__header {
    padding: 16px 16px 0 16px;
  }
  &__body {
    padding: 24px;
  }
}

.title {
  color: #1a1b21;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}
</style>
