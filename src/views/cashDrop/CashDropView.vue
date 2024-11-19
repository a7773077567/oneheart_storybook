<script setup lang="ts">
import { ref } from 'vue';
import { CashDropDetailsDialog } from '@/components/cashDrop';
import { useCashDropStore } from '@/stores/cashDrop';
import { useDialog } from '@/composables/dialog';
import { useNotify } from '@/composables/notify';

const cashDropStore = useCashDropStore();
const cashDropAmount = ref('');
const isCashDropDetailDialogOpen = ref(false);

async function onConfirm() {
  const { onOk } = await useDialog({ title: '確定要投庫嗎', message: '此動作無法復原。', type: 'confirm' });
  onOk(async () => {
    await cashDropStore.cashDrop({ cashDropAmount: +cashDropAmount.value });
    isCashDropDetailDialogOpen.value = true;
    useNotify('投庫完成');
    cashDropAmount.value = '';
  });
}
</script>

<template>
  <div class="cash-drop">
    <div class="cash-drop__input">
      <QInput v-model="cashDropAmount" label="投庫金額" type="number" hide-bottom-space placeholder="請輸入投庫金額" outlined dense style="flex-grow: 1" />
    </div>
    <QBtn class="cash-drop__submit" label="確定投庫" color="black" @click="onConfirm" />
    <CashDropDetailsDialog
      v-model="isCashDropDetailDialogOpen"
      :details="cashDropStore.cashDropDetails"
    />
  </div>
</template>

<style lang="scss" scoped>
.cash-drop {
  width: 640px;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__input {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__submit {
    align-self: flex-start;
    width: 126px;
  }
}
</style>
