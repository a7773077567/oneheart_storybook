<script setup lang='ts'>
import { computed, ref } from 'vue';
import { usePointsStore } from '@/stores';
import { ContractTypes, contractShareLink } from '@/api';
import { PointTypes } from '@/const/general';

defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
}>();

const pointStore = usePointsStore();
const isSigned = computed(() => pointStore.topupDetail.contractDottedsignTaskId);
const isLoading = ref(false);

const contractType = computed(() => {
  switch (pointStore.topupDetail.pointType) {
    case PointTypes.物理治療:
    case PointTypes.院長物理治療:
    case PointTypes.營養:
      return ContractTypes['儲值治療類合約'];
    case PointTypes.教練課:
      return ContractTypes['儲值運動類合約'];
    default:
      return ContractTypes['儲值治療類合約'];
  }
});
const successRedirectUrl = `${window.location.origin}/sign-success`;

async function handleSign() {
  isLoading.value = true;
  // todo, contractType 改成自動推斷
  const payload = JSON.stringify(({ ...pointStore.topupDetail, birthDate: pointStore.targetClient?.birthDate, identityNumber: pointStore.targetClient?.identityNumber, contractType: 'point' }));

  const { shareLink } = await contractShareLink({
    redirectUrl: successRedirectUrl,
    payloadJSONString: payload,
    type: contractType.value,
  });
  // show sign view in same page
  window.location.replace(shareLink);
  isLoading.value = false;
}
</script>

<template>
  <div class="sign_contract">
    <div class="sign_contract_content">
      <template v-if="isSigned">
        <p class="q-mb-lg">{{ ContractTypes[contractType] }}</p>
        <div class="flex items-center">
          <p class="contract_name">{{ `${ContractTypes[contractType]}.pdf` }}</p>
          <QIcon name="attach_file" />
        </div>
      </template>
      <div v-else class="flex items-center">
        <p class="q-mr-lg">{{ ContractTypes[contractType] }}</p>
        <QBtn :loading="isLoading" color="black" label="簽約" @click="handleSign" />
      </div>
    </div>
    <div class="q-my-lg flex">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn :disabled="!isSigned" size="md" label="下一步" color="black" class="q-px-lg" @click="$emit('goNext')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sign_contract {
  display: flex;
  flex-direction: column;
  &_content {
    padding: 24px 0;
  }
  .contract_name {
    text-decoration: underline;
    margin-right: 8px;
  }
}
</style>
