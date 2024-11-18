<script setup lang="ts">
import { onMounted, ref } from 'vue';

const printData = ref(JSON.parse(localStorage.getItem('printData')!));
window.addEventListener('afterprint', () => {
  setTimeout(() => window.close());
});

onMounted(() => {
  window.print();
  localStorage.removeItem('printData');
});
</script>

<template>
  <div class="cash-drop-print">
    <div class="cash-drop-details" v-html="printData" />
  </div>
</template>

<style lang="scss">
.cash-drop-print {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .cash-drop-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 600px;
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
}
</style>
