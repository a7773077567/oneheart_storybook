<script setup lang='ts'>
import { ref } from 'vue';
import TopupForm from '@/components/order/point/TopupForm.vue';
import TopupCheckout from '@/components/order/point/TopupCheckout.vue';
import { usePointsStore } from '@/stores';
import { OSteps } from '@/components/shared';

const steps = [{ label: '填寫儲值內容', key: 'form' }, { label: '選擇付款方式', key: 'checkout' }];
const currentStep = ref(steps[0]);
const pointsStore = usePointsStore();

function cancelTopup() {
  pointsStore.resetTopup();
}
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <TopupForm v-if="currentStep.key === 'form'" @go-next="currentStep = { label: '選擇付款方式', key: 'checkout' }" @cancel="cancelTopup" />
  <TopupCheckout v-else-if="currentStep.key === 'checkout'" @go-back="currentStep.key = 'form'" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
