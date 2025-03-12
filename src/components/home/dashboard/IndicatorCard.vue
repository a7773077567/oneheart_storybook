<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  label: string;
  caption: string;
  current: number;
  predict: number;
  total: number;
}>();

const color = computed(() => {
  switch (true) {
    case props.predict < props.current:
      return {
        bar: '#C2351A',
        text: '#C2351A',
      };
    case props.predict === props.current:
      return {
        bar: '#DBA100',
        text: '#3A4E6B',
      };
    case props.predict > props.current:
    default:
      return {
        bar: '#008524',
        text: '#008524',
      };
  }
});
const barColor = computed(() => color.value.bar);

const detailPageName = computed(() => {
  switch (props.name) {
    case 'referralCount':
    default:
      return 'referralCountView';
  }
});
</script>

<template>
  <QCard flat bordered class="indicator_card">
    <QCardSection horizontal class="indicator_card__title q-pa-none items-center justify-between">
      <div class="title">{{ label }}</div>
      <QBtn
        flat align="between" icon-right="chevron_right" style="color: #1A7AB3; width: 120px;" class="q-px-sm"
        @click="$router.push({ name: detailPageName })"
      >
        計分詳情
      </QBtn>
    </QCardSection>
    <QCardSection horizontal class="q-pa-none items-center justify-between">
      <div class="caption">{{ caption }}</div>
      <div class="text-subtitle2">滿分 {{ total }} 分</div>
    </QCardSection>

    <QSeparator class="q-mt-sm q-mb-md" />

    <QCardSection horizontal class="items-center justify-between q-mb-md">
      <div class="subtitle">目前得分 <span class="caption text-on-surface-variant">（前三個月）</span></div>
      <div class="text-subtitle2">{{ current }}分</div>
    </QCardSection>
    <QCardSection horizontal class="items-center justify-between q-mb-sm">
      <div class="subtitle">預測得分 <span class="caption text-on-surface-variant">（近三個月）</span></div>
      <div class="text-subtitle2" :style="{ color: color.text }">{{ predict }}分</div>
    </QCardSection>
    <QCardSection horizontal class="items-center justify-between">
      <progress id="progress_bar" :max="total" :value="predict" />
    </QCardSection>
  </QCard>
</template>

<style scoped lang="scss">
.indicator_card {
  width: 350px;
  height: 250px;
  padding: 24px;
  background: $surface-container-low;
  border: 1px solid $outline-variant;
  border-radius: 16px;
  &__title {
    margin-bottom: 20px;
  }
  .title {
    @include title-large($on-surface);
  }
  .caption {
    @include body-medium($on-surface);
  }
  .subtitle {
    @include body-large($on-surface);
  }
}
#progress_bar {
  width: 100%;
  height: 12px;
  border: none;
  appearance: none;
  border-radius: 50px;
}

#progress_bar::-webkit-progress-bar {
  background-color: $primary-tim-light;
  border-radius: 50px;
}

/* Filled part of the progress bar */
progress::-webkit-progress-value {
  background-color: v-bind(barColor);
  border-radius: 50px 0 0 50px;
}
progress[value='100']::-webkit-progress-value {
  background-color: v-bind(barColor);
  border-radius: 50px;
}

/* Firefox-specific styling */
progress::-moz-progress-bar {
  background-color: #4caf50;
}
</style>
