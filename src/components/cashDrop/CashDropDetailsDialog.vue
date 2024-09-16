<script setup lang="ts">
import { computed, ref } from 'vue';
import { GenericDialog, TwoColumnTable } from '@/components/shared';

const props = defineProps<{
  modelValue: boolean;
  mode: 'read' | 'edit';
  details: InstanceType<typeof TwoColumnTable>['$props']['data'];
  cashDropFunc?: () => Promise<any> ;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const title = computed(() => props.mode === 'read' ? '投庫明細' : '確認投庫');
const confirmLabel = computed(() => props.mode === 'read' ? '列印明細' : '確認投庫');
const confirmFunc = computed(() => props.mode === 'read' ? onPrint : onCashDrop);
const isPrintOpen = ref(false);

async function onCashDrop() {
  if (!props.cashDropFunc) {
    return;
  }
  try {
    await props.cashDropFunc();
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
  <div class="cash-drop-details-dialog">
    <GenericDialog
      v-model="model"
      :title="title"
      :cancel-btn="mode === 'edit'"
      :confirm-label="confirmLabel"
      persistent
      fit-content
      @confirm="confirmFunc"
      @cancel="model = false"
    >
      <template #body>
        <div class="cash-drop-details">
          <TwoColumnTable :data="details">
            <template #date="{ data }">
              <div style="padding: 10px;">{{ data.value }}</div>
            </template>
          </TwoColumnTable>
          <div class="signature"><span>簽名</span></div>
        </div>
      </template>
    </GenericDialog>

    <GenericDialog
      v-model="isPrintOpen"
      confirm-label="列印明細"
      persistent
      @confirm="isPrintOpen = false"
      @hide="onPrint"
    >
      <template #title>
        <p class="print-title">投庫紀錄已完成<br>請列印明細並簽名、完成投庫動作</p>
      </template>
      <template #body>
        <div class="print-message">
          <img src="@/assets/images/cashDrop/success.png" alt="success">
          <p>請記得將<b>簽名後的明細、應投入現金、發票及收據、作廢發票及收據、信用卡結帳單據</b>、其他單據一併放入夾鏈袋並投入金庫</p>
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

@media print {
  :global(.no-print) {
    display: none;
  }
}
</style>
