<script setup lang="ts">
import { computed, ref } from 'vue';
import { CashDropDetailsDialog } from '@/components/cashDrop';
import { useUserStore } from '@/stores';
import dayjs from 'dayjs';

const userStore = useUserStore();
const nowCashRemaining = ref(6000);
const cashDropAmount = ref(0);
const cashDropTime = ref('');
const isConfirmOpen = ref(false);

const cashDropDetails = computed(() => [
  { key: 'date', value: cashDropTime.value, span: true, custom: true },
  { key: 'account', value: userStore.userInfo?.name, label: '人員' },
  { key: 'space', value: userStore.currentSpace?.name, label: '場館' },
  { key: 'cashDropAmount', value: cashDropAmount.value, label: '投庫金額' },
  { key: 'remainCash', value: 0, label: '剩餘現金' },
]);

function dropCash() {
  cashDropTime.value = dayjs().format('YYYY-MM-DD HH:mm');
  isConfirmOpen.value = true;
}

async function onCashDrop() {
  await new Promise((resolve) => {
    console.log('onCashDrop');

    setTimeout(() => resolve('cashDrop done'), 1000);
  });
}
</script>

<template>
  <div class="cash-drop">
    <p class="cash-drop__display">上次投庫後的現金收入<span style="margin-left: 10px; font-weight: 700;">{{ nowCashRemaining.toLocaleString() }}</span></p>
    <div class="cash-drop__input">
      <span :style="{ color: '#BE0000' }">投庫金額</span>
      <QInput v-model="cashDropAmount" type="number" error hide-bottom-space no-error-icon placeholder="請輸入投庫金額" outlined dense style="flex-grow: 1" />
    </div>
    <p class="cash-drop__hint">投庫金額不可大於現金收入</p>
    <QBtn class="cash-drop__submit" label="投庫" color="black" @click="dropCash" />
    <CashDropDetailsDialog
      v-model="isConfirmOpen"
      mode="edit"
      :details="cashDropDetails"
      :cash-drop-func="onCashDrop"
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
  &__display {
    margin-bottom: 10px;
  }
  &__input {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &__hint {
    font-size: 16px;
    color: #be0000;
  }
  &__submit {
    align-self: flex-start;
    width: 126px;
  }
}
</style>
