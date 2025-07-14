<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores';
import { type PointsPaymentRecord, WorkState, updateChargetNSeller } from '@/api';
import { BasicBtn, BasicCard, BasicSelect } from '@/components/shared';
import { useNotify } from '@/composables/notify';

const props = defineProps<{
  data: PointsPaymentRecord;
}>();
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

const userStore = useUserStore();
const sellerOptions = computed(() => {
  const users = [...userStore.users]; // 離職人員順序排最後面
  return users.sort((a, b) => {
    if (a.stateOfWork === WorkState['離職'] && b.stateOfWork !== WorkState['離職'])
      return 1;
    if (a.stateOfWork !== WorkState['離職'] && b.stateOfWork === WorkState['離職'])
      return -1;
    return 0;
  });
});
const form = ref({
  sellers: props.data.sellers,
  chargers: props.data.chargers,
});

function handleConfirm() {
  updateChargetNSeller({ paymentId: props.data.id, chargerIds: form.value.chargers.map(p => p.id), sellerIds: form.value.sellers.map(p => p.id) }).then(() => {
    emit('confirm');
    useNotify('交易紀錄編輯成功');
  });
}
</script>

<template>
  <BasicCard title="編輯交易紀錄" width="480px" height="512px">
    <template #body>
      <div class="q-mb-md">
        <p class="text-title-small q-mb-sm">堂數交易 {{ data.clientName }}</p>
        <span class="text-body-medium">{{ data.date }}</span>
      </div>

      <form @submit.prevent>
        <BasicSelect
          v-model="form.chargers"
          multiple label="負責人(選填、可複選)" name="chargers" :options="sellerOptions"
          hide-bottom-space :virtual-scroll-item-size="50" :emit-value="false" error-message=""
          option-label="name"
          option-value="id"
          class="q-mb-md"
          map-options
        />
        <BasicSelect
          v-model="form.sellers"
          multiple label="銷售者(選填、可複選)" name="sellers" :options="sellerOptions"
          hide-bottom-space :virtual-scroll-item-size="50" :emit-value="false" error-message="" option-label="name"
          option-value="id"
          map-options
        />
      </form>
    </template>
    <template #footer>
      <BasicBtn flat color="primary" label="取消" @click="$emit('cancel')" />
      <BasicBtn color="primary" label="確定" @click="handleConfirm" />
    </template>
  </BasicCard>
</template>

<style scoped lang="scss">
</style>
