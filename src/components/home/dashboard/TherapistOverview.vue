<script setup lang="ts">
import { AllOptionSelect, InfoCard, OptionSelect, PieChart, SignalLight } from '@/components/shared';
import { EducationPointEdit } from '@/components/home/dashboard';
import { computed, ref } from 'vue';
import type { QSelectProps } from 'quasar';
import dayjs from 'dayjs';

type ChartData = InstanceType<typeof PieChart>['$props'];

const props = defineProps<{
  therapistSelect: number;
  rangeSelect: number;
  typeSelect: number[];
  therapistSelectOptions: QSelectProps['options'];
  rangeSelectOptions: QSelectProps['options'];
  typeSelectOptions: QSelectProps['options'];
  caseStatus: ChartData;
  checkoutPlan: ChartData;
}>();

const emit = defineEmits<{
  (e: 'update:therapistSelect', val: number): void;
  (e: 'update:rangeSelect', val: number): void;
  (e: 'update:typeSelect', val: number[]): void;
}>();

const therapistSelectModel = computed({
  get: () => props.therapistSelect,
  set: val => emit('update:therapistSelect', val),
});

const rangeSelectModel = computed({
  get: () => props.rangeSelect,
  set: val => emit('update:rangeSelect', val),
});

const typeSelectModel = computed({
  get: () => props.typeSelect,
  set: val => emit('update:typeSelect', val),
});

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

const dateRange = computed(() => {
  const today = dayjs();
  const startDate = today.startOf('month');
  return `${startDate.format('MM/DD')}-${today.format('MM/DD')}(今日)`;
});

const educationPoints = ref({
  predicted: info[4].value.predicted,
  current: info[4].value.current,
});
</script>

<template>
  <div class="overview">
    <div class="overview__header">
      <div class="title">治療師運營總覽</div>
      <OptionSelect v-model="therapistSelectModel" :options="therapistSelectOptions" />
    </div>
    <div class="overview__body">
      <div class="chart">
        <div class="chart__header">
          <OptionSelect v-model="rangeSelectModel" :options="rangeSelectOptions" />
        </div>
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
          <AllOptionSelect v-model="typeSelectModel" :options="typeSelectOptions" label="科別" style="width: 216px;" />
          <div class="date-range">{{ dateRange }}</div>
        </div>
        <div class="info__body">
          <!-- <SignalLight :predicted="2" :current="0" /> -->
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
    display: flex;
    align-items: center;
    gap: 16px;
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
  width: 409px;
  &__header {
    padding: 16px 16px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.date-range {
  font-size: 14px;
  // font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.25px;
}
</style>
