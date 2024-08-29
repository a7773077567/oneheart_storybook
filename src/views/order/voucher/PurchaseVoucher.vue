<script setup lang='ts'>
import { ref } from 'vue';
import VoucherForm from '@/components/order/voucher/VoucherForm.vue';
import VoucherCheckout from '@/components/order/voucher/VoucherCheckout.vue';
import { useVoucherStore } from '@/stores';

const step = ref<1 | 2>(1);
const voucherStore = useVoucherStore();

function cancelTopup() {
  voucherStore.$reset();
  step.value = 1;
}
</script>

<template>
  <VoucherForm v-if="step === 1" @go-next="step = 2" @cancel="cancelTopup" />
  <VoucherCheckout v-else-if="step === 2" @go-back="step = 1" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
