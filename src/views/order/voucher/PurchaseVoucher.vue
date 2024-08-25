<script setup lang='ts'>
import { ref } from 'vue';
import VoucherForm from '@/components/order/VoucherForm.vue';
import VoucherPurchase from '@/components/order/VoucherPurchase.vue';
import { useVoucherStore } from '@/stores';

const step = ref<1 | 2>(1);
const voucherStore = useVoucherStore();

function cancelTopup() {
  voucherStore.$reset();
  step.value = 1;
}
</script>

<template>
  <!-- <QBreadcrumbs class="text-grey" active-color="purple">
    <template #separator>
      <QIcon
        size="1.2em"
        name="arrow_forward"
        color="purple"
      />
    </template>

    <QBreadcrumbsEl label="Home" icon="home" />
    <QBreadcrumbsEl label="Components" icon="widgets" />
    <QBreadcrumbsEl label="Breadcrumbs" icon="navigation" />
  </QBreadcrumbs> -->

  <VoucherForm v-if="step === 1" @go-next="step = 2" @cancel="cancelTopup" />
  <VoucherPurchase v-else-if="step === 2" @go-back="step = 1" @cancel="cancelTopup" @finish="cancelTopup" />
</template>
