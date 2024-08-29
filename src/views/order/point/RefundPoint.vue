<script setup lang='ts'>
import { ref } from 'vue';
import { OSteps } from '@/components/shared';
import RefundForm from '@/components/order/point/RefundForm.vue';
import RefundCheckout from '@/components/order/point/RefundCheckout.vue';
import { usePointsStore } from '@/stores';
import type { Client, PointsGroup, RefundPoint } from '@/api';

const steps = [{ label: '填寫退款內容', key: 'form' }, { label: '選擇退款方式', key: 'checkout' }];
const currentStep = ref(steps[0]);

const pointsStore = usePointsStore();

function cancelTopup() {
  pointsStore.resetTopup();
  currentStep.value = steps[0];
}

export type RefundDetail = RefundPoint & { client: Partial<Client> | null; pointGroup: Partial<PointsGroup> | null };
const refundValues = ref<RefundDetail>({} as RefundDetail);
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <RefundForm v-if="currentStep.key === 'form'" v-model="refundValues" @go-next="currentStep = steps[1]" @cancel="cancelTopup" />
  <RefundCheckout v-else-if="currentStep.key === 'checkout'" v-model="refundValues" @go-back="currentStep = steps[0]" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
