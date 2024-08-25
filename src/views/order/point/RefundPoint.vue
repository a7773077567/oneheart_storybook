<script setup lang='ts'>
import { ref } from 'vue';
import { OSteps } from '@/components/shared';
import RefundForm from '@/components/order/point/RefundForm.vue';
import RefundCheckout from '@/components/order/point/RefundCheckout.vue';
import { usePointsStore } from '@/stores';

// const steps = [{ label: '填寫退款內容', key: 'form' }, { label: '選擇退款方式', key: 'checkout' }];
// const currentStep = ref(steps[0]);

// const pointsStore = usePointsStore();

// function cancelTopup() {
//   pointsStore.resetTopup();
//   // currentStep.value = 'form';
// }
</script>

<template>
  建置中
  <!-- <OSteps :steps="steps" :current-step="currentStep" />
  <RefundForm v-if="currentStep.key === 'form'" @go-next="currentStep = { label: '選擇付款方式', key: 'checkout' }" @cancel="cancelTopup" />
  <RefundCheckout v-else-if="currentStep.key === 'checkout'" @go-back="currentStep.key = 'form'" @cancel="cancelTopup" @finish="cancelTopup" /> -->
</template>
