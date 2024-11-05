<script setup lang="ts">
import { SimpleTable } from '@/components/shared';

defineProps<{
  rows: InstanceType<typeof SimpleTable>['$props']['rows'];
}>();

const fields: InstanceType<typeof SimpleTable>['$props']['fields'] = [
  { name: 'transactionTime', label: '交易時間', width: '140px' },
  { name: 'type', label: '項目' },
  { name: 'paymentMethod', label: '支付方式', width: '82px' },
  { name: 'amount', label: '金額', width: '82px', currency: true },
  { name: 'remainingCash', label: '剩餘現金', width: '82px', currency: true },
];
</script>

<template>
  <div class="handover-transactions">
    <div class="handover-transactions__title">
      <div class="title">班次內交易明細</div>
    </div>
    <div class="handover-transactions__body">
      <SimpleTable
        :fields="fields"
        :rows="rows"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.handover-transactions {
  &__body {
    // max-height: 336px;
    // overflow-y: scroll;
  }
}

.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 8px;
}
</style>
