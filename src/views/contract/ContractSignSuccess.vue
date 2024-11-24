<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { ContractTypes, updateClientFirstVisitContract } from '@/api';

const route = useRoute();
const router = useRouter();

const contractDetail = computed(() => {
  let _payload = route.query.payload;
  if (_payload && typeof route.query.payload === 'string') {
    return JSON.parse(route.query.payload);
  }
  return {};
});

watch(contractDetail, (contract) => {
  if (!contract)
    return;

  updateClientFirstVisitContract({
    clientId: +contract.clientId,
    clientScheduleId: +contract.scheduleId,
    firstVisitContractDottedsignTaskId: contract.taskId,
  });
}, {
  immediate: true,
});

async function handleRedirect() {
  if (!contractDetail.value)
    return;

  // 依照合約類型導向不同頁面
  switch ((contractDetail.value?.contractType)) {
    case ContractTypes['儲值治療類合約']:
      return router.push({ name: 'pointsTopup', query: {
        isSigned: 'true',
        content: JSON.stringify(contractDetail.value),
      } });
    case ContractTypes['儲值運動類合約']:
      return router.push({ name: 'GroupClassVoucher', query: {
        isSigned: 'true',
        content: JSON.stringify(contractDetail.value),
      } });
    case ContractTypes['物理治療初診就診須知']:
    default:{
      if (!contractDetail.value.scheduleId) {
        return router.push({ name: 'appointmentListCalendar' });
      }
      return router.push({ name: 'appointmentListInfo', params: { scheduleId: contractDetail.value.scheduleId } });
    }
  }
}

const btnLabel = computed(() => {
  switch ((contractDetail.value?.contractType)) {
    case ContractTypes['儲值治療類合約']:
    case ContractTypes['儲值運動類合約']:
      return '請返回交易流程繼續完成結帳';
    case ContractTypes['物理治療初診就診須知']:
    default:
      return '返回預約資料';
  }
});
</script>

<template>
  <div class="sign_success">
    <h2 class="q-mb-md">合約簽署已完成</h2>
    <QIcon name="check_circle" color="green" size="54px" class="q-mb-xl" />
    <QBtn class="q-px-lg" color="black" :label="btnLabel" @click="handleRedirect" />
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
