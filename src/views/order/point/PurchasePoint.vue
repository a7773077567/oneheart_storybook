<script setup lang='ts'>
import { ref } from 'vue';
import TopupForm from '@/components/order/point/TopupForm.vue';
import TopupCheckout from '@/components/order/point/TopupCheckout.vue';
import TopupSign from '@/components/order/point/TopupSign.vue';
import { usePointsStore } from '@/stores';
import { OSteps } from '@/components/shared';
import { useRoute } from 'vue-router';

const steps = [{ label: '填寫儲值內容', key: 'form' }, { label: '合約書簽約', key: 'contract' }, { label: '選擇付款方式', key: 'checkout' }];
const currentStep = ref(steps[0]);
const pointsStore = usePointsStore();

function cancelTopup() {
  pointsStore.resetTopup();
  currentStep.value = steps[0];
}

// if is signed
const route = useRoute();
if (route.query.isSign === 'true') {
  currentStep.value = steps[1];
}
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <TopupForm v-if="currentStep.key === 'form'" @go-next="currentStep = { label: '選擇付款方式', key: 'contract' }" @cancel="cancelTopup" />
  <TopupSign v-else-if="currentStep.key === 'contract'" />
  <TopupCheckout v-else-if="currentStep.key === 'checkout'" @go-back="currentStep.key = 'contract'" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
