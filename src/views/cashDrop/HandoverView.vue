<script setup lang="ts">
import { HandoverDetailsDialog, HandoverMisc, HandoverTitle } from '@/components/cashDrop';
import type { SimpleTable } from '@/components/shared';
import { computed, ref } from 'vue';

type SimpleTableRows = InstanceType<typeof SimpleTable>['$props']['rows'];

const handoverMisc = ref<InstanceType<typeof HandoverMisc>['$props']['modelValue']>([]);
const isHandoverDetailsOpen = ref(false);
const overallData = {
  totalRevenue: 6000,
  initialCash: 5000,
  cashFlow: 1950,
  totalCashDrop: 2000,
  remainingCash: 4950,
};

const transactionRows = computed<SimpleTableRows>(() => {
  const miscRows: SimpleTableRows = handoverMisc.value.map((item) => {
    return {
      type: { val: item.name, span: 3 },
      amount: { val: item.amount, color: 'rgba(212, 20, 20, 1)' },
      remainingCash: { val: 3000 },
    };
  });
  return [
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000, color: 'rgba(212, 20, 20, 1)' }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '19:40' }, type: { val: '投庫', icon: '/images/safe-box.svg' }, paymentMethod: { val: '現金' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000 }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000, color: 'rgba(212, 20, 20, 1)' }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '19:40' }, type: { val: '投庫', icon: '/images/safe-box.svg' }, paymentMethod: { val: '現金' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000 }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000, color: 'rgba(212, 20, 20, 1)' }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '19:40' }, type: { val: '投庫', icon: '/images/safe-box.svg' }, paymentMethod: { val: '現金' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000 }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000, color: 'rgba(212, 20, 20, 1)' }, remainingCash: { val: 2000 } },
    { transactionTime: { val: '19:40' }, type: { val: '投庫', icon: '/images/safe-box.svg' }, paymentMethod: { val: '現金' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:40' }, type: { val: '治療費' }, paymentMethod: { val: 'Linepay' }, amount: { val: 2000 }, remainingCash: { val: 5000 } },
    { transactionTime: { val: '18:50' }, type: { val: '堂數退款' }, paymentMethod: { val: '現金' }, amount: { val: 3000 }, remainingCash: { val: 2000 } },
    ...miscRows,
  ];
});

async function onHandover() {
  console.log('onHandover');
}
</script>

<template>
  <div class="handover">
    <div class="handover__header">
      <HandoverTitle />
    </div>
    <div class="handover__details">
      <HandoverMisc v-model="handoverMisc" />
    </div>
    <div class="handover__action">
      <QBtn label="確定" color="dark" style="width: 126px;" @click="isHandoverDetailsOpen = true" />
    </div>

    <HandoverDetailsDialog
      v-model="isHandoverDetailsOpen"
      :overall-data="overallData"
      :transaction-rows="transactionRows"
      :handover-func="onHandover"
      mode="edit"
    />
  </div>
</template>

<style lang="scss" scoped>
.handover {
  padding-top: 22px;
  &__header {
    margin-bottom: 24px;
  }
  &__details {
    margin-bottom: 32px;
  }
}
</style>
