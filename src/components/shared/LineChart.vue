<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { CategoryScale, Chart as ChartJS, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { computed } from 'vue';
import { assign } from 'radash';

type LineOptions = InstanceType<typeof Line>['$props']['options'];

const props = defineProps<{
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  options?: LineOptions;
}>();

ChartJS.register(Title, Tooltip, CategoryScale, LinearScale, LineElement, PointElement);

const defaultOptions: LineOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const lineData = computed(() => ({
  labels: props.labels,
  datasets: [{ data: props.data }],
}));

const lineOptions = computed(() => props.options ? assign(defaultOptions, props.options) : defaultOptions);
</script>

<template>
  <Line :data="lineData" :options="lineOptions" />
</template>

<style lang="scss" scoped>

</style>
