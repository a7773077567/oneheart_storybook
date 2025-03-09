<script setup lang='ts'>
import { computed } from 'vue';
import type { TrafficLightStatistic } from '@/api';

const props = defineProps<{
  overview: TrafficLightStatistic;
}>();

const list = computed(() => [
  {
    name: 'executionCount',
    label: '執行數',
    current: props.overview.executionCount.currentPoint,
    predict: props.overview.executionCount.predictionPoint,
  },
  {
    name: 'returnVisitRate',
    label: '回診率',
    current: props.overview.returnVisitRate.currentPoint,
    predict: props.overview.returnVisitRate.predictionPoint,
  },
  {
    name: 'presonalRevenue',
    label: '個人營業額',
    current: props.overview.presonalRevenue.currentPoint,
    predict: props.overview.presonalRevenue.predictionPoint,
  },
  {
    name: 'referralCount',
    label: '轉介數',
    current: props.overview.referralCount.currentPoint,
    predict: props.overview.referralCount.predictionPoint,
  },
  {
    name: 'educationPoint',
    label: '教育積分',
    current: props.overview.educationPoint.currentPoint,
    predict: props.overview.educationPoint.predictionPoint,
  },
  {
    name: 'googleCommentCount',
    label: 'Google 評論數',
    current: props.overview.googleCommentCount.currentPoint,
    predict: props.overview.googleCommentCount.predictionPoint,
  },
]);
</script>

<template>
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
</template>

<style scoped lang="scss">
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
</style>
