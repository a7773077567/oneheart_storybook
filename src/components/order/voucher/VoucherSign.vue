<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useVoucherStore } from '@/stores';
import { ContractTypes, contractShareLink } from '@/api';

defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
}>();

const voucherStore = useVoucherStore();
const isSigned = computed(() => voucherStore.voucherDetail?.contractDottedsignTaskId);
const isLoading = ref(false); ;
const successRedirectUrl = `${window.location.origin}/sign-success`;

async function handleSign() {
  isLoading.value = true;
  // todo, contractType 改成自動推斷
  const payload = JSON.stringify(({ ...voucherStore.voucherDetail, birthDate: voucherStore.targetClient?.birthDate, identityNumber: voucherStore.targetClient?.identityNumber, contractType: 'voucher' }));

  const { shareLink } = await contractShareLink({
    redirectUrl: successRedirectUrl,
    payloadJSONString: payload,
    type: ContractTypes['儲值運動類合約'],
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
        <p class="q-mb-lg">儲值運動類合約</p>
        <div class="flex items-center">
          <p class="contract_name">儲值運動類合約.pdf</p>
          <QIcon name="attach_file" />
        </div>
      </template>
      <div v-else class="flex items-center">
        <p class="q-mr-lg">儲值運動類合約</p>
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
