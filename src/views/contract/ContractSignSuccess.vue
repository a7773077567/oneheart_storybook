<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const contractDetail = computed(() => {
  let _payload = route.query.payload;
  if (_payload && typeof route.query.payload === 'string') {
    return JSON.parse(route.query.payload);
  }
  return {};
});

function handleRedirect() {
  console.log(contractDetail.value);

  if (!contractDetail.value)
    return;

  // 依照合約類型導向不同頁面
  switch ((contractDetail.value?.contractType)) {
    case 'point':
      return router.push({ name: 'pointsTopup', query: {
        isSigned: 'true',
        content: JSON.stringify(contractDetail.value),
      } });
    case 'voucher':
      return router.push({ name: 'GroupClassVoucher', query: {
        isSigned: 'true',
        content: JSON.stringify(contractDetail.value),
      } });
    case 'newClient':
    default:
      return router.push({ name: 'appointmentListInfo', params: { scheduleId: contractDetail.value.scheduleId } });
  }
}

const btnLabel = computed(() => {
  switch ((contractDetail.value?.contractType)) {
    case 'point':
    case 'voucher':
      return '請返回交易流程繼續完成結帳';
    case 'newClient':
    default:
      return '返回預約資料';
  }
});
</script>

<template>
  <div class="sign_success">
    <h2 class="q-mb-md">合約簽署已完成</h2>
    <QIcon name="check_circle" color="green" size="54px" class="q-mb-xl" />
    <p class="q-mb-xl">{{ btnLabel }}</p>
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
