<script setup lang='ts'>
import { ref } from 'vue';
import TopupForm from '@/components/order/point/TopupForm.vue';
import TopupCheckout from '@/components/order/point/TopupCheckout.vue';

// import TopupSign from '@/components/order/point/TopupSign.vue';
import { usePointsStore, useUserStore } from '@/stores';
import { OSteps } from '@/components/shared';
import { useRoute, useRouter } from 'vue-router';

const steps = [
  { label: '填寫儲值內容', key: 'form' },
  // { label: '合約書簽約', key: 'contract' },
  { label: '選擇付款方式', key: 'checkout' },
];
const currentStep = ref(steps[0]);
const pointsStore = usePointsStore();

function cancelTopup() {
  pointsStore.resetTopup();
  currentStep.value = steps[0];
}

const router = useRouter();
function finishTopup() {
  pointsStore.resetTopup();
  router.push({ name: 'pointsTopup' });
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
    pointsStore.topupDetail = { ...signedContent, contractDottedsignTaskId: signedContent.taskId };
    pointsStore.targetClient = { birthDate: signedContent.birthDate, identityNumber: signedContent.identityNumber };
  }
}

// get seller data
const userStore = useUserStore();
userStore.getUsers();
</script>

<template>
  <OSteps :steps="steps" :current-step="currentStep" />
  <TopupForm v-if="currentStep.key === 'form'" @go-next="currentStep = steps[1]" @cancel="cancelTopup" />
  <!-- <TopupSign v-else-if="currentStep.key === 'contract'" @go-next="currentStep = steps[1]" @cancel="cancelTopup" /> -->
  <TopupCheckout v-else-if="currentStep.key === 'checkout'" @go-back="currentStep = steps[0]" @cancel="cancelTopup" @finish="finishTopup" />
</template>
