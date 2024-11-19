<script setup lang="ts">
import { computed } from 'vue';
import { HandoverOverall, HandoverTransactions } from '@/components/cashDrop';
import type { SimpleTable } from '@/components/shared';
import router from '@/router';

const props = defineProps<{
  modelValue: boolean;
  overallData: InstanceType<typeof HandoverOverall>['$props']['data'];
  transactionRows: InstanceType<typeof SimpleTable>['$props']['rows'];
  duration: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

function goPrint() {
  const printContents = document.querySelector('.handover-details')!.innerHTML;
  localStorage.setItem('printData', JSON.stringify(printContents));
  window.open(router.resolve({ name: 'handoverPrint' }).href, '_black');
}
</script>

<template>
  <div class="handover-details-dialog">
    <GenericDialog
      v-model="model"
      title="交班已完成，請列印明細並簽名"
      confirm-label="列印明細"
      @cancel="model = false"
      @confirm="goPrint"
    >
      <template #header>
        <p>請記得將<b>簽名後的明細、應投入現金、發票及收據、作廢發票及收據、信用卡結帳單據</b>、其他單據一併放入夾鏈袋並投入金庫</p>
      </template>

      <template #body>
        <div class="handover-details">
          <div class="handover-details__title">交班明細</div>
          <div class="handover-details__duration">{{ duration }}</div>
          <div class="handover-details__overall">
            <HandoverOverall :data="overallData" />
          </div>
          <div class="handover-details__transactions">
            <HandoverTransactions :rows="transactionRows" />
          </div>
          <div class="handover-details__signature">
            <div class="signature"><span>簽名</span></div>
          </div>
        </div>
      </template>
    </GenericDialog>
  </div>
</template>

<style lang="scss" scoped>
.handover-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  &__title {
    font-size: 24px;
    font-weight: 500;
    line-height: 36px;
  }
  &__duration {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    letter-spacing: 0.1px;
  }
  &__signature {
    align-self: flex-end;
  }
}

.signature {
  width: 334px;
  height: 45px;
  align-self: flex-end;
  font-size: 20px;
  border-bottom: 1px solid rgb(70, 5, 5);
}
</style>
