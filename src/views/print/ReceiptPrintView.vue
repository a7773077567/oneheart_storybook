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
  <div class="receipt-print">
    <div class="receipt" v-html="printData" />
  </div>
</template>

<style lang="scss">
%cell-style {
  border: 1px solid black;
  font-size: 15px;
  font-weight: 500;
  padding: 5px;
}

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

.table {
  width: 100%;
  border: 1px solid black;
  border-spacing: 3px;
  border-collapse: separate;
  th {
    @extend %cell-style;
  }
  td {
    @extend %cell-style;
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
