<script setup lang="ts">
withDefaults(defineProps<{
  rows: {
    name: string | undefined;
    label: string;
    value: any;
  }[];
  spaceName?: string;
  hideCheckout?: boolean;
  title?: string;
  confirmLabel?: string;
  hidePrint?: boolean; // to refactor, temporary solution for refund checkout
}>(), {
  title: '結帳確定',
  confirmLabel: '確定結帳',
});

defineEmits<{
  (e: 'checkout'): void;
  (e: 'close'): void;
}>();

function print() {
  window.print();

  // const printContents = document.querySelector('.receipt')!.innerHTML;
  // const originalContents = document.body.innerHTML;
  // document.body.innerHTML = printContents;
  // window.print();
  // document.body.innerHTML = originalContents;

  // const printContent = document.querySelector('.receipt')!.innerHTML;
  // const printWindow = window.open('', 'printWindow', 'height=auto, width=8cm')!;
  // printWindow.document.write('<html><head>');
  // printWindow.document.write(style);
  // printWindow.document.write('</head><body>');
  // printWindow.document.write(printContent);
  // printWindow.document.write('</body></html>');
}
</script>

<template>
  <QCard class="q-py-md q-px-xl relative-position">
    <QIcon v-close-popup name="close" color="black" class="cursor-pointer absolute-right no-print" size="24px" style="top: 10px; right: 10px;" />
    <QCardSection class="q-pb-none no-print">
      <div class="text-h6 text-center q-mb-md text-bold">{{ title }}</div>
      <slot name="subtitle">
        <div class="text-subtitle2 text-center">確定以現金方式支付，如確定無誤請按按鈕。</div>
      </slot>
    </QCardSection>
    <QCardSection>
      <div class="receipt">
        <p class="receipt__title">{{ spaceName }}</p>
        <p class="receipt__subtitle">醫療費用收據（客戶聯）</p>
        <div class="receipt__body">
          <table class="table">
            <tr v-for="(row, key) in rows" :key="key">
              <td>{{ row.label }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </table>
        </div>
        <div class="receipt__stamp">
          <img src="@/assets/images/appointment/duty-stamp.png" alt="">
        </div>
      </div>
    </QCardSection>
    <QCardActions class="actions no-print">
      <QBtn v-if="hidePrint" label="返回編輯" outline @click="$emit('close')" />
      <QBtn v-else label="列印收據" outline @click="print" />
      <QBtn v-if="!hideCheckout" :label="confirmLabel" color="black" @click="$emit('checkout')" />
    </QCardActions>
  </QCard>
</template>

<style lang="scss" scoped>
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

.actions {
  > .q-btn {
    flex: 1;
  }
}

@media print {
  .no-print {
    display: none;
  }

  .q-card {
    padding: 0 !important;
    box-shadow: none;
  }
  .q-card__section {
    padding: 0 !important;
  }
  .receipt {
    border: none;
    padding: 0;
    scale: (0.82);
    transform-origin: top left;
  }
  @page {
    margin: -3mm;
    size: 80mm 115mm;
  }
}
</style>
