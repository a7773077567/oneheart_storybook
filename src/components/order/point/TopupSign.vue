<script setup lang='ts'>
import { computed } from 'vue';
import { usePointsStore } from '@/stores';
import { ContractType, contractShareLink } from '@/api';
import { PointTypes } from '@/const/general';

defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
}>();

const pointStore = usePointsStore();

const test = JSON.stringify({
  clientName: 'Sherry',
  clientId: 1,
  clientPhone: '0978709231',
  groupName: '1人物理群',
  clientGroupId: 5,
  plan: 1,
  pointType: 1,
  paidPointGained: 5,
  giftPointGained: 0,
  amount: 9500,
  planName: '9500元：5堂',
});

const contractType = computed(() => {
  switch (pointStore.topupDetail.pointType) {
    case PointTypes.物理治療:
    case PointTypes.院長物理治療:
    case PointTypes.營養:
      return ContractType['儲值治療類合約'];
    case PointTypes.教練課:
      return ContractType['儲值運動類合約'];
    default:
      return ContractType['儲值治療類合約'];
  }
});

async function handleSign() {
  const payload = JSON.stringify(pointStore.topupDetail);
  // const payload = JSON.stringify(test);
  const { shareLink } = await contractShareLink({
    redirectUrl: `https://localhost:5173/order/sign-success`,
    payloadJSONString: payload,
    type: contractType.value,
  });
  console.log(shareLink);

  // show sign view in same page
  window.location.replace(shareLink);
}

// todo, if sign success, show contract name and enable download
</script>

<template>
  <div class="sign_contract">
    <div class="flex items-center">
      <p class="q-mr-lg">儲值治療類合約書</p>
      <QBtn color="black" label="簽約" @click="handleSign" />
    </div>
    <div class="q-my-lg flex">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn size="md" label="下一步" color="black" class="q-px-lg" @click="$emit('goNext')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sign_contract {
  display: flex;
  flex-direction: column;
}
</style>
