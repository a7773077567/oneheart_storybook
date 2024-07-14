<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CheckTable } from '@/components/appointment';
import { useVoucherStore } from '@/stores';
import dayjs from 'dayjs';
import { PaymentTypes } from '@/const/general';
import { type PurchaseVoucher, buyGroupClassTickets } from '@/api';
import { useQuasar } from 'quasar';

defineEmits<{
  (e: 'cancel'): void;
  (e: 'goBack'): void;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];

const voucherStore = useVoucherStore();
const selectedPayment = ref<PaymentTypes>(PaymentTypes.現金);

const purchaseDetail = computed<CheckTableData>(() => [
  { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
  { key: 'name', value: voucherStore.voucherDetail?.clientName ?? '', label: '姓名' },
  { key: 'phone', value: voucherStore.voucherDetail?.clientPhone ?? '', label: '電話' },
  { key: 'classId', value: '瑜伽課', label: '團課名稱' },
  { key: 'ticketGained', value: `${voucherStore.voucherDetail?.ticketGained} 張`, label: '數量' },
  { key: 'amount', value: `$ ${(voucherStore.voucherDetail?.amount ?? 0)}`, label: '金額' },
]);

const payment: CheckTableData = [
  { key: 'title', value: '支付方式', span: true, custom: true },
  { key: 'payment', span: true, custom: true },
];

const paymentGroup = [
  { label: '現金', value: PaymentTypes.現金 },
  { label: '轉帳', value: PaymentTypes.匯款 },
  { label: '信用卡', value: PaymentTypes.信用卡 },
  { label: 'Line Pay', value: PaymentTypes.LINEPay },
  { label: '街口', value: PaymentTypes.街口 },
];

const summary = computed(() => [
  { key: 'amount', value: voucherStore.voucherDetail?.amount, span: true, custom: true },
  { key: 'detailTitle', label: '付款明細', span: true, custom: true },
  { key: 'cashDetails', label: '現金', value: voucherStore.voucherDetail?.amount, span: true, custom: true },
]);

const $q = useQuasar();
async function submit() {
  console.log(voucherStore.voucherDetail);
  const { clientId, groupClassId, ticketGained, amount, payMethod } = voucherStore.voucherDetail as PurchaseVoucher;

  await buyGroupClassTickets({
    clientId,
    groupClassId,
    ticketGained,
    amount,
    payMethod,
    authorisationCode: null, // todo, 複合式結帳時需修改
    receiptNumber: null, // todo, 複合式結帳時需修改
  });
  $q.dialog({
    message: '購買成功',
  });
}
</script>

<template>
  <div class="purchase_point">
    <CheckTable :data="purchaseDetail">
      <template #date="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
    </CheckTable>

    <CheckTable :data="payment">
      <template #title="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
      <template #payment>
        <QOptionGroup
          v-model="selectedPayment" :options="paymentGroup" inline left-label color="black"
          class="slot-padding--payment q-gutter-x-md"
        />
      </template>
    </CheckTable>

    <CheckTable :data="summary">
      <template #amount="{ data: { value } }">
        <div class="flex justify-between items-center slot-padding">
          <div class="summary">
            <span>結帳金額：</span>
            <div class="summary_amount">
              {{ value }}
            </div>
            <span>元</span>
          </div>
          <QBtn label="結帳" outline style="width: 125px; font-size: 16px" @click="submit" />
        </div>
      </template>
      <template #detailTitle="{ data }">
        <div class="slot-padding">
          {{ data.label }}
        </div>
      </template>
      <template #cashDetails="{ data }">
        <div class="flex justify-between slot-padding">
          <span>現金</span>
          <span>$ {{ data.value }}</span>
        </div>
      </template>
    </CheckTable>

    <div class="q-my-lg">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn color="black" size="md" label="上一步" class="q-px-lg" @click="$emit('goBack')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.purchase_point {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 676px;

  .slot-padding {
    padding: 10px;

    &--payment {
      @extend .slot-padding;
      padding: 18px 10px;
    }
  }

  .summary {
    display: flex;
    align-items: center;
    gap: 5px;

    &_amount {
      width: 134px;
      background: #f5f5f5;
      padding: 4px 6px;
      border-radius: 2px;
      text-align: end;
    }
  }
}
</style>
