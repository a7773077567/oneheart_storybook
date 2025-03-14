<script setup lang='ts'>
import { computed } from 'vue';
import type { TrafficLightStatistic } from '@/api';
import ScoreLight from './ScoreLight.vue';

const props = defineProps<{
  userId: number;
  currentPoint: number;
  predictPoint: number;
  indicatorList: TrafficLightStatistic;
  noData: boolean;
}>();

const list = computed(() => [
  {
    name: 'executionCount',
    label: '執行數',
    current: props.indicatorList.executionCount.currentPoint,
    predict: props.indicatorList.executionCount.predictionPoint,
  },
  {
    name: 'returnVisitRate',
    label: '回診率',
    current: props.indicatorList.returnVisitRate.currentPoint,
    predict: props.indicatorList.returnVisitRate.predictionPoint,
  },
  {
    name: 'presonalRevenue',
    label: '個人營業額',
    current: props.indicatorList.presonalRevenue.currentPoint,
    predict: props.indicatorList.presonalRevenue.predictionPoint,
  },
  {
    name: 'referralCount',
    label: '轉介數',
    current: props.indicatorList.referralCount.currentPoint,
    predict: props.indicatorList.referralCount.predictionPoint,
  },
  {
    name: 'educationPoint',
    label: '教育積分',
    current: props.indicatorList.educationPoint.currentPoint,
    predict: props.indicatorList.educationPoint.predictionPoint,
  },
  {
    name: 'googleCommentCount',
    label: 'Google 評論數',
    current: props.indicatorList.googleCommentCount.currentPoint,
    predict: props.indicatorList.googleCommentCount.predictionPoint,
  },
]);
</script>

<template>
  <div class="traffic-light-statics" :class="{ empty_state: noData }">
    <div class="traffic-light-statics__header">
      <h3 class="title">紅綠燈分數</h3>
      <QBtn :disable="noData" flat :style="{ color: noData ? '#767680' : '#1A7AB3' }" label="紅綠燈指標詳情" icon-right="chevron_right" @click="$router.push({ name: 'trafficLightOverview', params: { userId } })" />
    </div>
    <QBanner dense rounded class="q-py-xs q-mb-md" style="background:rgba(26, 122, 179, 0.16)">
      <template #avatar>
        <QIcon flat name="o_info" size="sm" color="primary" />
      </template>
      <template #default>
        <p class="text-weight-medium">資料不足三個月，無法統計紅綠燈分數。</p>
      </template>
    </QBanner>
    <div class="traffic-light-statics__body">
      <div>
        <ScoreLight label="目前總分" :score="currentPoint" class="q-mb-sm" :no-data="noData" />
        <ScoreLight label="預測總分" :score="predictPoint" :no-data="noData" />
      </div>
      <div class="indicator-list">
        <QList separator>
          <QItem class="indicator-list__header">
            <QItemSection>紅綠燈指標</QItemSection>
            <QItemSection style="text-align: end;">目前得分/預測得分</QItemSection>
          </QItem>
          <QItem v-for="item in list" :key="item.name" class="indicator-list__body">
            <QItemSection class="">
              {{ item.label }}
            </QItemSection>
            <QItemSection class="score">
              {{ item?.current ?? 0 }}
            </QItemSection>
            <QItemSection class="score">{{ item?.predict ?? 0 }}</QItemSection>
          </QItem>
        </QList>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.traffic-light-statics {
  padding: 24px;
  &.empty_state {
    .indicator-list {
      &__header :deep(.q-item__section),
      &__body :deep(.q-item__section) {
        color: $outline;
      }
      color: #767680 !important;
    }
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .title {
    @include title-medium($on-surface-variant);
  }
  a {
    text-decoration: none;
  }
  .indicator-list {
    &__header :deep(.q-item__section) {
      @include label-large($on-surface-variant);
    }
    &__body :deep(.q-item__section) {
      @include title-medium($on-surface);
    }
    .score {
      width: 50px;
      flex: 0 0 50px;
    }
  }
}
</style>
