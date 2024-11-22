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
  <div class="handover-print">
    <div class="handover-details" v-html="printData" />
  </div>
</template>

<style lang="scss">
.handover-print {
  padding: 10px;
  .handover-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 600px;
    &__title {
      font-size: 24px;
      font-weight: 500;
      line-height: 36px;
    }
    &__duration {
      font-size: 20px;
      font-weight: 400;
      line-height: 30px;
      letter-spacing: 0.1px;
    }
    &__signature {
      align-self: flex-end;
    }
  }

  .signature {
    width: 334px;
    height: 45px;
    align-self: flex-end;
    font-size: 20px;
    border-bottom: 1px solid rgb(70, 5, 5);
  }

  .overall {
    display: flex;
    gap: 24px;
    &__item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    &__item-label {
      line-height: 24px;
    }
    &__item-val {
      font-size: 20px;
      font-weight: 500;
      line-height: 30px;
    }
  }

  .simple-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid black;
    &__cell {
      height: 48px;
      padding: 0 12px;
      vertical-align: middle;
      border: 1px solid black;
      font-size: 14px;
      &--col {
        @extend .simple-table__cell;
        text-align: left;
      }
      &--icon {
        @extend .simple-table__cell;
      }
    }
    &__cell-box {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

@media print {
  .handover-print {
    zoom: 49%;
  }
  @page {
    margin: 0;
    size: 80mm 140mm;
    scale: 0.5;
  }
}
</style>
