<script setup lang='ts'>
import { computed } from 'vue';
import ScoreLight from '@/components/home/dashboard/ScoreLight.vue';
import IndicatorCard from '@/components/home/dashboard/IndicatorCard.vue';
import { useTrafficLight } from '@/stores';
import { QSeparator } from 'quasar';
import dayjs from 'dayjs';
import ScoreCheer from '@/components/home/dashboard/ScoreCheer.vue';

const props = defineProps<{
  userId: string;
  userName: string;
}>();

const trafficLightStore = useTrafficLight();
trafficLightStore.getTherapistTrafficLight({ userId: +props.userId });

const currentScoreRange = computed(() => {
  const startMonth = dayjs().subtract(3, 'month').format('YYYY 年 M 月');
  const endMonth = dayjs().subtract(1, 'month').format('YYYY 年 M 月');
  return `${startMonth} - ${endMonth} (前三個月)`;
});
const predictScoreRange = computed(() => {
  const startMonth = dayjs().subtract(2, 'month').format('YYYY 年 M 月');
  const endMonth = dayjs().subtract(0, 'month').format('YYYY 年 M 月');
  return `${startMonth} - ${endMonth} (近三個月)`;
});

const indicatorList = computed(() => [
  {
    name: 'returnVisitRate',
    detailPage: 'returnVisitRateDetail',
    label: '回診率',
    caption: '得分採三個月平均',
    total: trafficLightStore.targetTherapistTrafficLight.returnVisitRate.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.returnVisitRate.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.returnVisitRate.predictionPoint,
  },
  {
    name: 'executionCount',
    detailPage: 'executionCountDetail',
    label: '執行數',
    caption: '得分採三個月平均',
    total: trafficLightStore.targetTherapistTrafficLight.executionCount.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.executionCount.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.executionCount.predictionPoint,
  },
  {
    name: 'presonalRevenue',
    detailPage: 'personalRevenueDetail',
    label: '個人營業額',
    caption: '得分採三個月平均',
    total: trafficLightStore.targetTherapistTrafficLight.presonalRevenue.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.presonalRevenue.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.presonalRevenue.predictionPoint,
  },
  {
    name: 'referralCount',
    detailPage: 'referralCountDetail',
    label: '轉介數',
    caption: '各月人數加總後換算得分',
    total: trafficLightStore.targetTherapistTrafficLight.referralCount.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.referralCount.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.referralCount.predictionPoint,
  },
  {
    name: 'educationPoint',
    detailPage: 'educationPointDetail',
    label: '教育積分',
    caption: '各月積分加總後換算得分',
    total: trafficLightStore.targetTherapistTrafficLight.educationPoint.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.educationPoint.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.educationPoint.predictionPoint,
  },
  {
    name: 'googleCommentCount',
    detailPage: 'googleCommentCountDetail',
    label: 'Google 評論數',
    caption: '得分採三個月平均',
    total: trafficLightStore.targetTherapistTrafficLight.googleCommentCount.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.googleCommentCount.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.googleCommentCount.predictionPoint,
  },
]);
</script>

<template>
  <div class="traffic_light_detail">
    <h2 class="q-my-md text-headline-medium text-on-surface-variant">紅綠燈詳情</h2>
    <section class="traffic_light_detail__header">
      <ScoreLight full-info label="目前總分" :score="trafficLightStore.targetTherapistTrafficLight.currentPoint" :caption="currentScoreRange" :rules="trafficLightStore.trafficLightRules" />
      <ScoreLight full-info label="預測總分" :score="trafficLightStore.targetTherapistTrafficLight.predictionPoint" :caption="predictScoreRange" :rules="trafficLightStore.trafficLightRules" />
      <ScoreCheer :score="trafficLightStore.targetTherapistTrafficLight.predictionPoint" />
      <ul v-if="!trafficLightStore.isHighestPT" class="traffic_light_rules">
        <li v-for="rule in trafficLightStore.targetTherapistTrafficLight.rules" :key="rule.light" class="rule_item text-body-small text-on-surface-variant">
          <div :class="`signal_${rule.light}`" class="signal" />
          <p v-if="rule.light === 'green'">綠燈： {{ rule.min }}  &#8804; 總分 </p>
          <p v-else-if="rule.light === 'yellow'">黃燈： {{ rule.min }} &#8804; 總分 &#60; {{ rule.max }}</p>
          <p v-else>紅燈： 總分 &#60; {{ rule.max }}</p>
        </li>
      </ul>
    </section>
    <QSeparator class="q-mb-lg" />
    <section class="traffic_light_detail__footer">
      <h3 class="q-mb-sm text-title-medium text-on-surface-variant">紅綠燈由以下六項指標得分加總</h3>
      <p class="caption text-body-medium text-on-surface-variant">分為 <b>預測</b> 和 目前 <b>得分</b>。預測得分採近三個月數據計算，反映未來趨勢；目前得分則採用前三個月數據，呈現已達成的表現。</p>
      <section class="row indicator_list q-col-gutter-md">
        <div v-for="({ detailPage, name, ...cardProps }) in indicatorList" :key="name" class="col">
          <IndicatorCard v-bind="{ name, ...cardProps }" @check-detail="$router.push({ name: detailPage, params: { userId, userName } })" />
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
.traffic_light_detail {
  .caption {
    margin-bottom: 24px;
  }
  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  &__footer {
    .indicator_list {
      justify-content: left;
      & > .col {
        width: fit-content;
        min-width: fit-content;
        flex: 0 1 auto;
      }
    }
  }
  .traffic_light_rules {
    > .rule_item + .rule_item {
      margin-top: 4px;
    }
    .rule_item {
      display: flex;
      align-items: center;
      gap: 8px;
      .signal {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        &_red {
          background-color: #c2351a;
        }
        &_green {
          background-color: #30b313;
        }
        &_yellow {
          background-color: #dba100;
        }
      }
    }
  }
}
</style>
