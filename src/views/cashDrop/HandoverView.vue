<script setup lang="ts">
import type { HandoverMisc } from '@/components/cashDrop';
import { HandoverCashDrop, HandoverDetails, HandoverDetailsDialog } from '@/components/cashDrop';
import type { SimpleTable } from '@/components/shared';
import { useDialog } from '@/composables/dialog';
import { useHandoverStore } from '@/stores';
import { removeCookie } from '@/utils/helpers';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

type SimpleTableRows = InstanceType<typeof SimpleTable>['$props']['rows'];

const router = useRouter();
const handoverStore = useHandoverStore();
const cashDropAmount = ref('');
const handoverMisc = ref<InstanceType<typeof HandoverMisc>['$props']['modelValue']>([]);
const isHandoverDetailsOpen = ref(false);

watch(isHandoverDetailsOpen, (newVal) => {
  if (newVal === false) {
    removeCookie('firstToken');
    removeCookie('secondToken');
    removeCookie('lastSpaceId');
    router.go(0);
  }
});

const transactionRows = computed<SimpleTableRows>(() => {
  const { handoverDetails } = handoverStore;
  if (!handoverDetails) {
    return [];
  }
  const { cashDrops, detailedExpenses } = handoverDetails;
  return [...cashDrops, ...detailedExpenses];
});

async function readyToHandover() {
  if (containEmptyValue()) {
    useDialog({
      title: '系統提示',
      message: '尚有細項名稱或金額未填寫',
      type: 'confirm',
    });

    return;
  }

  const { onOk } = await useDialog({
    title: '確定要交班嗎',
    message: '交班後帳號將自動登出。',
    type: 'confirm',
  });

  onOk(async () => {
    await handoverStore.changeShift({
      cashDropAmount: +cashDropAmount.value,
      detailedExpenses: handoverMisc.value,
    });
    isHandoverDetailsOpen.value = true;
  });
}

function containEmptyValue() {
  return handoverMisc.value.length && handoverMisc.value.some(({ name, amount }) => name.trim().length === 0 || +amount === 0);
}
</script>

<template>
  <div class="handover">
    <div class="handover__cash-drop">
      <HandoverCashDrop v-model="cashDropAmount" />
    </div>

    <div class="handover__details">
      <HandoverDetails v-model="handoverMisc" />
      <HandoverDetailsDialog
        v-if="isHandoverDetailsOpen"
        v-model="isHandoverDetailsOpen"
        :overall-data="handoverStore.handoverDetails!.overall"
        :transaction-rows="transactionRows"
        :duration="handoverStore.handoverDetails!.duration"
      />
    </div>

    <div class="handover__action">
      <QBtn label="確定交班" color="dark" style="width: 126px;" @click="readyToHandover" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.handover {
  max-width: 640px;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
