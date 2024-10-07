<script setup lang='ts'>
import { ref } from 'vue';
import VoucherForm from '@/components/order/voucher/VoucherForm.vue';
import VoucherCheckout from '@/components/order/voucher/VoucherCheckout.vue';

// import VoucherSign from '@/components/order/voucher/VoucherSign.vue';
import { useVoucherStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';

const voucherStore = useVoucherStore();

const steps = [
  { label: '填寫購買內容', key: 'form' },
  // { label: '合約書簽約', key: 'contract' },  #394 暫時移除簽約步驟
  { label: '選擇付款方式', key: 'checkout' },
];
const currentStep = ref(steps[0]);

function cancelTopup() {
  voucherStore.$reset();
  currentStep.value = steps[0];
}

// if contract is signed
const route = useRoute();
const { isSigned, content } = route.query;

checkContractStatus();
function checkContractStatus() {
  if (isSigned === 'true' && content && typeof content === 'string') {
    currentStep.value = steps[1];
    const signedContent = JSON.parse(content);
    voucherStore.voucherDetail = { ...signedContent, contractDottedsignTaskId: signedContent.taskId };
    voucherStore.targetClient = { birthDate: signedContent.birthDate, identityNumber: signedContent.identityNumber };
  }
}

const router = useRouter();
function finishPurchase() {
  voucherStore.$reset();
  router.push({ name: 'GroupClassVoucher' });
  currentStep.value = steps[0];
}
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <VoucherForm v-if="currentStep.key === 'form'" @go-next="currentStep = steps[1]" @cancel="cancelTopup" />
  <!-- <VoucherSign v-else-if="currentStep.key === 'contract'" @go-next="currentStep = steps[2]" /> -->
  <VoucherCheckout v-else @cancel="cancelTopup" @finish="finishPurchase" />
</template>
