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
    name: 'referralCount',
    detailPage: 'referralCountView',
    label: '轉介數',
    caption: '各月人數加總後換算得分',
    total: trafficLightStore.targetTherapistTrafficLight.referralCount.totalPoint,
    current: trafficLightStore.targetTherapistTrafficLight.referralCount.currentPoint,
    predict: trafficLightStore.targetTherapistTrafficLight.referralCount.predictionPoint,
  },
]);

// const trafficLightRules = computed(() => trafficLightStore.targetTherapistTrafficLight.rules.map(rule => ({ ...rule, title: rule.light === 'red' ? '紅燈' : rule.light === 'green' ? '綠燈' : '黃燈' })));
</script>

<template>
  <div class="traffic_light_detail">
    <h2 class="q-my-md">紅綠燈詳情</h2>
    <section class="traffic_light_detail__header">
      <ScoreLight full-info label="目前總分" :score="trafficLightStore.targetTherapistTrafficLight.currentPoint" :caption="currentScoreRange" />
      <ScoreLight full-info label="預測總分" :score="trafficLightStore.targetTherapistTrafficLight.predictionPoint" :caption="predictScoreRange" />
      <ScoreCheer :current="trafficLightStore.targetTherapistTrafficLight.currentPoint" />
      <ul class="traffic_light_rules">
        <li v-for="rule in trafficLightStore.targetTherapistTrafficLight.rules" :key="rule.light" class="rule_item">
          <div :class="`signal_${rule.light}`" class="signal" />
          <p v-if="rule.light === 'green'">綠燈： {{ rule.min }}  &#8804; 總分 </p>
          <p v-else-if="rule.light === 'yellow'">黃燈： {{ rule.min }} &#8804; 總分 &#60; {{ rule.max }}</p>
          <p v-else>紅燈： 總分 &#60; {{ rule.max }}</p>
        </li>
      </ul>
    </section>
    <QSeparator class="q-mb-lg" />
    <section class="traffic_light_detail__footer">
      <h3 class="q-mb-sm">紅綠燈由以下六項指標得分加總</h3>
      <p class="caption">分為 <b>預測</b> 和 目前 <b>得分</b>。預測得分採近三個月數據計算，反映未來趨勢；目前得分則採用前三個月數據，呈現已達成的表現。</p>
      <section class="row indicator_list">
        <div v-for="({ detailPage, name, ...cardProps }) in indicatorList" :key="name" class="col">
          <IndicatorCard v-bind="{ name, ...cardProps }" @check-detail="$router.push({ name: detailPage, params: { userId } })" />
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
.traffic_light_detail {
  h2 {
    @include headline-medium($on-surface-variant);
  }
  h3 {
    @include title-medium($on-surface-variant);
  }
  .caption {
    @include body-medium($on-surface-variant);
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
      gap: 16px;
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
      @include body-small($on-surface-variant);
    }
  }
}
</style>
