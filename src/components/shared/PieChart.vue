<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, type TooltipCallbacks } from 'chart.js';
import { computed } from 'vue';
import { assign, pick } from 'radash';
import { ChartInfo } from '@/components/shared';

type PieOptions = InstanceType<typeof Pie>['$props']['options'];

const props = defineProps<{
  title: string;
  subtitle?: string;
  chartData: {
    labels: string[];
    data: any[];
    backgroundColor: string[];
  };
  infoData: InstanceType<typeof ChartInfo>['$props']['data'];
  infoCaption?: string;
  showInfoScroll?: boolean;
  options?: PieOptions;
  tooltip?: string[];
}>();

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement);

const defaultOptions: PieOptions = {
  datasets: {
    pie: {
      borderWidth: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      caretSize: 0,
      padding: {
        top: 8,
        right: 14,
        bottom: 8,
        left: 14,
      },
      bodyFont: {
        weight: 500,
        size: 12,
        lineHeight: '20px',
      },
      callbacks: {
        title: () => '',
        label: ctx => (ctx.raw as { tooltip: string[] }).tooltip,
      },
      backgroundColor: '#313137',
    },
  },
};

const pieData = computed(() => ({
  labels: props.chartData.labels,
  datasets: [{ ...pick(props.chartData, ['data', 'backgroundColor']) }],
}));
const pieOptions = computed(() => props.options ? assign(defaultOptions, props.options) : defaultOptions);
</script>

<template>
  <div class="chart">
    <div class="chart__info">
      <div class="chart__title-box">
        <div class="chart__title">{{ title }}</div>
        <div v-if="subtitle" class="chart__subtitle">{{ subtitle }}</div>
      </div>
      <div class="chart__info-items">
        <ChartInfo :data="infoData" :caption="infoCaption" :show-scroll="showInfoScroll" />
      </div>
    </div>
    <div class="chart__diagram">
      <div class="diagram">
        <Pie :data="pieData" :options="pieOptions" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  display: flex;
  gap: 24px;
  justify-content: space-between;

  &__diagram {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  &__title-box {
    margin-bottom: 14px;
  }

  &__title {
    color: #1a1b21;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.15px;
    margin-bottom: 4px;
  }
  &__subtitle {
    color: #1a1b21;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.5px;
  }
}

.diagram {
  width: 192px;
}
</style>
