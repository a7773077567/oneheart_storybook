<script setup lang="ts">
import { computed, ref } from 'vue';
import { HandoverOverall, HandoverTransactions } from '@/components/cashDrop';
import type { SimpleTable } from '@/components/shared';

const props = defineProps<{
  modelValue: boolean;
  mode: 'read' | 'edit';
  overallData: InstanceType<typeof HandoverOverall>['$props']['data'];
  transactionRows: InstanceType<typeof SimpleTable>['$props']['rows'];
  handoverFunc?: () => Promise<any>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const title = computed(() => props.mode === 'read' ? '交班明細' : '確認交班明細');
const confirmLabel = computed(() => props.mode === 'read' ? '列印明細' : '確認交班');
const confirmFunc = computed(() => props.mode === 'read' ? onPrint : onCashDrop);
const isPrintOpen = ref(false);

async function onCashDrop() {
  if (!props.handoverFunc) {
    return;
  }
  try {
    await props.handoverFunc();
    isPrintOpen.value = true;
  }
  catch (err) {
    console.log(err);
  }
}

function onPrint() {
  emit('update:modelValue', false);
  window.print();
}
</script>

<template>
  <div class="handover-details-dialog">
    <GenericDialog
      v-model="model"
      :title="title"
      :cancel-btn="mode === 'edit'"
      :confirm-label="confirmLabel"
      @cancel="$emit('update:modelValue', false)"
      @confirm="confirmFunc"
    >
      <template #body>
        <div class="details">
          <div class="details__time">
            <div class="datetime">2024-08-13  <span class="datetime__time">18:00-20:50</span></div>
          </div>
          <div class="details__overall">
            <HandoverOverall :data="overallData" />
          </div>
          <div class="details__transactions">
            <HandoverTransactions :rows="transactionRows" />
          </div>
          <div class="details__signature">
            <div class="signature"><span>簽名</span></div>
          </div>
        </div>
      </template>
    </GenericDialog>

    <GenericDialog
      v-model="isPrintOpen"
      confirm-label="列印明細"
      persistent
      width="480px"
      @confirm="isPrintOpen = false"
      @hide="onPrint"
    >
      <template #title>
        <p class="print-title">交班已完成<br>請列印明細並簽名、完成投庫動作</p>
      </template>
      <template #body>
        <div class="print-message">
          <img src="@/assets/images/cashDrop/success.png" alt="success">
          <p>請記得將<b>簽名後的明細、應投入現金、發票及收據、作廢發票及收據、信用卡結帳單據、其他單據</b>一併放入夾鏈袋並投入金庫</p>
        </div>
      </template>
    </GenericDialog>
  </div>
</template>

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  &__signature {
    align-self: flex-end;
  }
}
.datetime {
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0.1px;
  &__time {
    font-weight: 500;
  }
}

.signature {
  width: 334px;
  height: 45px;
  align-self: flex-end;
  font-size: 20px;
  border-bottom: 1px solid rgb(70, 5, 5);
}

.print-message {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  > p {
    font-size: 16px;
    line-height: 24px;
  }
}
.print-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  line-height: 36px;
}
</style>
