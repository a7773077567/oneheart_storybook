<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { CheckTable, CheckoutAction, PaymentComposition, Receipt } from '@/components/appointment';
import { useUserStore, useVoucherStore } from '@/stores';
import dayjs from 'dayjs';
import { type PurchaseVoucher, buyGroupClassTickets } from '@/api';
import { useQuasar } from 'quasar';
import { PaymentMethod, PaymentMethods } from '@/const/appointment';
import { calcReceiptAmount, checkGender } from '@/utils/helpers';
import type { VoucherDetail } from '@/stores/voucher';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goBack'): void;
  (e: 'finish'): void;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
  type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const voucherStore = useVoucherStore();
const userStore = useUserStore();
const totalAmount = computed({
  get: () => voucherStore.voucherDetail?.amount ?? 0,
  set(amount) {
    voucherStore.voucherDetail = {
      ...voucherStore.voucherDetail as VoucherDetail,
      amount: amount ?? 0,
    };
  },
});
const payments = ref<Payments>([]);
const methodOptions = Object.values(PaymentMethods).filter(({ forGroupTicketPurchasing }) => forGroupTicketPurchasing).map(({ label, identifier }) => ({ label, value: identifier }));
const isCheckoutOpen = ref(false);
const receiptData = computed(() => {
  const { clientName, groupClassName } = voucherStore.voucherDetail!;
  const { identityNumber, birthDate } = voucherStore.targetClient ?? { identityNumber: '', birthDate: '' };
  return [
    { name: 'name', label: '姓名', value: clientName },
    { name: 'gender', label: '性別', value: checkGender(identityNumber ?? null)?.label ?? '' },
    { name: 'id', label: '身分證字號', value: identityNumber },
    { name: 'birthDate', label: '出生年月日', value: birthDate },
    { name: 'groupClassName', label: '課程名稱', value: groupClassName },
    { name: 'amount', label: '金額', value: calcReceiptAmount(payments.value) },
  ];
});

const purchaseDetail = computed<CheckTableData>(() => [
  { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
  { key: 'name', value: voucherStore.voucherDetail?.clientName ?? '', label: '姓名' },
  { key: 'phone', value: voucherStore.voucherDetail?.clientPhone ?? '', label: '電話' },
  { key: 'classId', value: voucherStore.voucherDetail?.groupClassName ?? '', label: '團課名稱' },
  { key: 'ticketGained', value: `${voucherStore.voucherDetail?.ticketGained} 張`, label: '數量' },
  { key: 'amount', value: `$ ${(voucherStore.voucherDetail?.amount ?? 0)}`, label: '金額' },
]);

const $q = useQuasar();
const isProceeding = ref(false);

async function onCheckout() {
  const { clientId, groupClassId, ticketGained, amount,
    //  contractDottedsignTaskId #394 暫時移除簽約步驟
  } = voucherStore.voucherDetail as PurchaseVoucher;
  const multiChannelPay = payments.value.map(({ payMethod, amount, authorisationCode, receiptNumber, details }) => {
    return { payMethod, amount, authorisationCode, receiptNumber, details };
  });
  const hasEmptyPayAmount = multiChannelPay.some(item => !item.amount);
  if (hasEmptyPayAmount) {
    $q.dialog({
      message: '所有支付方式的金額皆需填入',
    });
    return;
  }
  isProceeding.value = true;
  try {
    await buyGroupClassTickets({
      clientId,
      groupClassId,
      ticketGained,
      amount,
      multiChannelPay,
      // contractDottedsignTaskId: `${contractDottedsignTaskId}`,  #394 暫時移除簽約步驟
    });

    $q.dialog({
      message: '購買成功',
    }).onOk(() =>
      emit('finish'),
    );
  }
  finally {
    isProceeding.value = false;
  }
}

// set amount to $0 when payment method is 堂數
watch(payments, (chosenPayments) => {
  const includePointPayment = chosenPayments.some(pay => pay.payMethod === PaymentMethod['堂數']);
  if (includePointPayment && totalAmount.value !== 0) {
    totalAmount.value = 0;
  }
});
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
    <CheckoutAction v-model="totalAmount" @checkout="isCheckoutOpen = true" />
    <PaymentComposition v-model="payments" :method-options="methodOptions" />

    <div class="q-my-lg">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn color="black" size="md" label="上一步" class="q-px-lg" @click="$emit('goBack')" />
    </div>
    <QDialog v-model="isCheckoutOpen">
      <Receipt :rows="receiptData" :is-loading="isProceeding" :space-id="userStore?.currentSpace?.id" checkout="onCheckout" />
    </QDialog>
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
