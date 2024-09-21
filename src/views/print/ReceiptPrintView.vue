<script setup lang="ts">
import { usePrintStore } from '@/stores/print';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const printStore = usePrintStore();
const router = useRouter();

onMounted(() => {
  window.print();
  printStore.data = '';
  router.back();
});
</script>

<template>
  <div class="receipt-print">
    <div class="receipt" v-html="printStore.data" />
  </div>
</template>

<style lang="scss" scoped>
.receipt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 338px;
  padding: 30px;
  border: 1px solid black;
  &__title {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    > span {
      font-size: 15px;
      font-weight: 500;
    }
  }
  &__subtitle {
    text-align: center;
  }
  &__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__stamp {
    bottom: 30px;
    width: 200px;
    img {
      width: 100%;
    }
  }
}

@media print {
  .receipt {
    border: none;
  }
  @page {
    margin: 0;
    size: 80mm 140mm;
  }
}
</style>
