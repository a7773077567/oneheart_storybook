<script setup lang='ts'>
import { ref } from 'vue';
import { OSteps } from '@/components/shared';
import RefundVoucherForm from '@/components/order/voucher/RefundVoucherForm.vue';
import RefundVoucherCheckout from '@/components/order/voucher/RefundVoucherCheckout.vue';
import type { Client, RefundGroupClassTicket, Voucher } from '@/api';

const steps = [{ label: '填寫退款內容', key: 'form' }, { label: '選擇退款方式', key: 'checkout' }];
const currentStep = ref(steps[0]);

function cancelTopup() {
  currentStep.value = steps[0];
}

export type RefundDetail = RefundGroupClassTicket & { client: Partial<Client> | null; groupClass: Partial<Voucher> | null };
const refundValues = ref<RefundDetail>({} as RefundDetail);
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <RefundVoucherForm v-if="currentStep.key === 'form'" v-model="refundValues" @go-next="currentStep = steps[1]" @cancel="cancelTopup" />
  <RefundVoucherCheckout v-else-if="currentStep.key === 'checkout'" v-model="refundValues" @go-back="currentStep = steps[0]" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
