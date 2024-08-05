<script setup lang='ts'>
import { ref } from 'vue';
import TopupForm from '@/components/order/TopupForm.vue';
import PointsPurchase from '@/components/order/PointsPurchase.vue';
import { usePointsStore } from '@/stores';

const step = ref<1 | 2>(1);
const pointsStore = usePointsStore();

function cancelTopup() {
  pointsStore.resetTopup();
  step.value = 1;
}
</script>

<template>
  <TopupForm v-if="step === 1" @go-next="step = 2" @cancel="cancelTopup" />
  <PointsPurchase v-else-if="step === 2" @go-back="step = 1" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
