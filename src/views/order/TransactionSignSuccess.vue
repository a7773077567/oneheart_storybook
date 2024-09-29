<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { pointsGroupOptions } from '@/const/general';

const route = useRoute();
const router = useRouter();

const contractDetail = computed(() => {
  console.log(route.query);
  let _payload = route.query.payload;
  if (_payload && typeof route.query.payload === 'string') {
    console.log(JSON.parse(route.query.payload));
    return JSON.parse(route.query.payload);
  }
  return {};
});

function handleRedirect() {
  console.log(contractDetail.value);

  if (!contractDetail.value)
    return;

  switch ((contractDetail.value?.contractType)) {
    case 'point':
      return router.push({ name: 'pointsTopup', query: {
        isSigned: 'true',
        content: JSON.stringify(contractDetail.value),
      } });
    case 'groupClass':
      return router.push({ name: 'GroupClassVoucher', query: {
        isSigned: 'true',
        content: contractDetail.value,
      } });
      // todo, redirect 病歷單
    case 'newClient':
    default:
      return router.push({ name: 'GroupClassVoucher', query: {
        isSigned: 'true',
        content: contractDetail.value,
      } });
  }
}

// {
//   "clientName": "Sherry",
//   "clientId": 1,
//   "clientPhone": "0978709231",
//   "groupName": "測試群組",
//   "clientGroupId": 8,
//   "plan": 3,
//   "pointType": 2,
//   "paidPointGained": 5,
//   "giftPointGained": 0,
//   "amount": 14500,
//   "planName": "14500元：5堂",
//   "contractType": "point",
//   "taskId": 3018465
// }
</script>

<template>
  <div class="sign_success">
    <h2 class="q-mb-md">合約書簽約已完成</h2>
    <QIcon name="check_circle" color="green" size="54px" class="q-mb-xl" />
    <p class="q-mb-xl">請返回交易流程繼續完成結帳</p>
    <QBtn class="q-px-lg" color="black" label="返回" @click="handleRedirect" />
  </div>
</template>

<style scoped lang="scss">
.sign_success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 32px;
  }
}
</style>
