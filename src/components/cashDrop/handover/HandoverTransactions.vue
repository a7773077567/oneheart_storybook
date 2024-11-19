<script setup lang="ts">
import { SimpleTable } from '@/components/shared';

defineProps<{
  rows: InstanceType<typeof SimpleTable>['$props']['rows'];
}>();

const fields: InstanceType<typeof SimpleTable>['$props']['fields'] = [
  { name: 'time', label: '交易時間' },
  { name: 'type', label: '項目' },
  { name: 'method', label: '支付方式' },
  { name: 'amount', label: '項目' },
];
</script>

<template>
  <div class="handover-transactions">
    <SimpleTable
      :fields="fields"
      :rows="rows"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
