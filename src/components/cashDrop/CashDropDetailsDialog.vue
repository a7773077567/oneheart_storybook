<script setup lang="ts">
import { computed } from 'vue';
import { GenericDialog, TwoColumnTable } from '@/components/shared';
import router from '@/router';

const props = defineProps<{
  modelValue: boolean;
  details: InstanceType<typeof TwoColumnTable>['$props']['data'];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

function goPrint() {
  const printContents = document.querySelector('.cash-drop-details')!.innerHTML;
  localStorage.setItem('printData', JSON.stringify(printContents));
  window.open(router.resolve({ name: 'cashDropPrint' }).href, '_black');
}
</script>

<template>
  <div class="cash-drop-details-dialog">
    <GenericDialog
      v-model="model"
      title="投庫已完成，請列印明細並簽名"
      cancel-btn
      confirm-label="列印明細"
      cancel-label="返回"
      persistent
      fit-content
      @confirm="goPrint"
      @cancel="model = false"
    >
      <template #body>
        <p class="print-message">請記得將<b>簽名後的明細、應投入現金、發票及收據、作廢發票及收據、信用卡結帳單據</b>、其他單據一併放入夾鏈袋並投入金庫</p>
        <QSeparator spaced="24px" />
        <div class="cash-drop-details">
          <div class="cash-drop-details__title">投庫明細</div>
          <TwoColumnTable :data="details">
            <template #date="{ data }">
              <div style="padding: 10px;">{{ data.value }}</div>
            </template>
          </TwoColumnTable>
          <div class="cash-drop-details__signature"><span>簽名</span></div>
        </div>
      </template>
    </GenericDialog>
  </div>
</template>

<style lang="scss" scoped>
.cash-drop-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  &__title {
    font-size: 28px;
    font-weight: 500;
    line-height: 36px;
  }
  &__signature {
    width: 334px;
    height: 45px;
    align-self: flex-end;
    font-size: 20px;
    border-bottom: 1px solid rgb(70, 5, 5);
  }
}

.print-message {
  font-size: 16px;
  line-height: 24px;
}
.print-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  line-height: 36px;
}

@media print {
  :global(.no-print) {
    display: none;
  }
  :global(.generic-dialog) {
    overflow: visible;
  }
  :global(.q-dialog__inner) {
    top: initial;
    bottom: initial;
  }
}
</style>

<style>
@media print {
  html,
  body {
    height: initial !important;
    overflow: initial !important;
  }
}
</style>
