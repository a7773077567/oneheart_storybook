<script setup lang="ts">
import { InfoCard, MultiOptionSelect, OptionSelect, PieChart, SignalLight } from '@/components/shared';
import { EducationPointEdit } from '@/components/home/dashboard';
import { computed } from 'vue';
import type { QSelectProps } from 'quasar';
import dayjs from 'dayjs';
import type { TherapistEducationPoint, TherapistOverviewStatistic } from '@/types/home/dashboard/admin';
import { RangeSelectOptions } from '@/const/dashboard';
import TrafficLightStatics from './TrafficLightStatics.vue';
import { RoleType } from '@/api';
import type { TrafficLightStatistic } from '@/api';
import { useUserStore } from '@/stores';

type ChartData = InstanceType<typeof PieChart>['$props'];

const props = defineProps<{
  therapistSelect: number;
  rangeSelect: string;
  typeSelect: number[];
  therapistSelectOptions: QSelectProps['options'];
  typeSelectOptions: QSelectProps['options'];
  caseStatus: ChartData;
  checkoutPlan: ChartData;
  educationPoint: TherapistEducationPoint;
  hideEducationPoint?: boolean;
  overview: TherapistOverviewStatistic;
  isManagement: boolean;
  trafficLightOverview: TrafficLightStatistic;
}>();

const emit = defineEmits<{
  (e: 'update:therapistSelect', val: number): void;
  (e: 'update:rangeSelect', val: string): void;
  (e: 'update:typeSelect', val: number[]): void;
  (e: 'update:educationPoint', val: TherapistEducationPoint): void;
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

const educationPointModel = computed({
  get: () => props.educationPoint,
  set: val => emit('update:educationPoint', val),
});

const info = computed(() => [
  {
    name: 'avgExecutionCount',
    label: '平均執行數',
    value: props.overview.averageExecutionCount,
    caption: '治療師每日平均工作量',
  },
  {
    name: 'returnVisitRate',
    label: '回診率',
    value: props.overview.returnVisitRate === null ? '沒有初診客戶' : `${props.overview.returnVisitRate}%`,
    caption: '初診客戶回診率',
    shrinkFontSize: props.overview.returnVisitRate === null,
  },
  {
    name: 'clientRate',
    label: '會員率',
    value: props.overview.clientRate === null ? '沒有初診客戶' : `${props.overview.clientRate}%`,
    caption: '初診客戶是否購買堂數',
    shrinkFontSize: props.overview.clientRate === null,
  },
  {
    name: 'referralCount',
    label: '轉介數',
    value: props.overview.referralCount,
    caption: '治療師受客戶轉介次數',
  },
  {
    name: 'educationPoint',
    label: '教育積分填寫',
    value: props.educationPoint,
    hide: props.hideEducationPoint,
  },
]);

const dateRange = computed(() => {
  const today = dayjs();
  const startDate = today.startOf('month');
  return `${startDate.format('MM/DD')}-${today.format('MM/DD')}(今日)`;
});

const overAllTherapist = computed(() => props.therapistSelectOptions?.find(option => option.label === '所有治療師')?.value);

const userStore = useUserStore();
const selectedName = computed<string>(() => userStore.role === RoleType['物理治療師'] ? userStore.userInfo?.name : props.therapistSelectOptions?.find(option => option.value === therapistSelectModel.value)?.label ?? '');
</script>

<template>
  <div class="overview">
    <div v-if="isManagement" class="overview__header">
      <div class="title">治療師運營總覽</div>
      <OptionSelect v-model="therapistSelectModel" :options="therapistSelectOptions" />
    </div>
    <div class="overview__body">
      <div class="chart">
        <div class="chart__header">
          <OptionSelect v-model="rangeSelectModel" :options="RangeSelectOptions" />
        </div>
        <div class="chart__body">
          <PieChart v-bind="caseStatus" />
          <PieChart v-bind="checkoutPlan" />
        </div>
      </div>

      <div class="overview__body-separator" />

      <div class="info">
        <template v-if="therapistSelectModel !== overAllTherapist">
          <TrafficLightStatics :user-id="therapistSelect" :user-name="selectedName" :current-point="trafficLightOverview.currentPoint" :predict-point="trafficLightOverview.predictionPoint" :indicator-list="trafficLightOverview" :no-data="!trafficLightOverview.isWorkOverThreeMonth" />
        </template>
        <template v-else>
          <div class="info__header">
            <MultiOptionSelect v-model="typeSelectModel" :options="typeSelectOptions" label="科別" style="width: 216px;" />
            <div class="date-range">{{ dateRange }}</div>
          </div>
          <div class="info__body">
            <InfoCard :data="info">
              <template #educationPoint>
                <EducationPointEdit v-model="educationPointModel" />
              </template>
            </InfoCard>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview {
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
  flex-grow: 1;
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
