<script setup lang='ts'>
import { computed, nextTick, ref } from 'vue';
import { CheckTable, PaymentComposition, Receipt } from '@/components/appointment';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { PaymentMethods } from '@/const/appointment';
import type { RefundDetail } from '@/views/order/voucher/RefundVoucher.vue';
import { useRouter } from 'vue-router';
import { refundClassTicker } from '@/api';
import { calcReceiptAmount } from '@/utils/helpers';
import { useUserStore } from '@/stores';
import { useDialog } from '@/composables/dialog';

const props = defineProps<{
  modelValue: RefundDetail;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goBack'): void;
  (e: 'finish'): void;
  (e: 'update:modelValue', data: typeof props['modelValue']): void;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const userStore = useUserStore();
const isCheckoutOpen = ref(false);
const payments = ref<Payments>([]);
const methodOptions = Object.values(PaymentMethods).filter(payment => payment.forPointAndGroup).map(({ label, identifier }) => ({ label, value: identifier }));

const refundDetail = computed<CheckTableData>(() => {
  const { client, groupClass, amount } = props.modelValue;
  return [
    { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
    { key: 'name', value: client?.name ?? '', label: '姓名' },
    { key: 'phone', value: client?.phone ?? '', label: '電話' },
    { key: 'classId', value: groupClass?.name ?? '', label: '團課名稱' },
    { key: 'ticketGained', value: `${groupClass?.useAbleGroupClassTickets ?? 0} 張`, label: '數量' },
    { key: 'amount', value: `$ ${(amount)}`, label: '金額' },
  ];
});

// receipt
const receiptData = computed(() => {
  const { client, groupClass } = props.modelValue;
  return [
    { name: 'name', label: '姓名', value: client?.name ?? '' },
    { name: 'gender', label: '性別', value: client?.gender ?? '' },
    { name: 'id', label: '身分證字號', value: client?.identityNumber ?? '' },
    { name: 'birthDate', label: '出生年月日', value: client?.birthDate ?? '' },
    { name: 'groupClassName', label: '課程名稱', value: groupClass?.name ?? '' },
    { name: 'amount', label: '金額', value: `$${calcReceiptAmount(payments.value)}` },
    { name: 'pointGained', label: '張數', value: `${groupClass?.useAbleGroupClassTickets ?? 0}張` },
  ];
});

const $q = useQuasar();
const router = useRouter();
async function onCheckout() {
  const { clientId, groupClassId, amount } = props.modelValue;
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
  await refundClassTicker({
    clientId,
    groupClassId,
    amount,
    multiChannelPay,
  });

  const { onOk, onCancel } = await useDialog({
    title: '退款已完成',
    message: '退款已完成，您可在「查詢交易紀錄」檢視此筆交易',
    okLabel: '列印收據',
    cancelLabel: '結束',
  });

  onOk(() => {
    // after success dialog close then do the print
    nextTick(() => {
      window.print();
      emit('finish');
    });
  },
  );
  onCancel(() => {
    router.push({ name: 'transactionRecords' });
  });
}
</script>

<template>
  <div class="refund_voucher">
    <CheckTable :data="refundDetail">
      <template #date="{ data }">
        <div class="slot-padding">
          {{ data.value }}
        </div>
      </template>
    </CheckTable>
    <div class="refund_point_amount">
      退款總額 &nbsp;<span class="refund_point_amount--val">{{ modelValue.amount }} 元</span>
    </div>
    <PaymentComposition v-model="payments" :method-options="methodOptions" />

    <div class="q-my-lg">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn color="red" size="md" label="確認退款結帳" class="q-px-lg" @click="isCheckoutOpen = true" />
    </div>

    <QDialog v-model="isCheckoutOpen">
      <Receipt hide-print :rows="receiptData" payment-method="現金" :space-name="userStore?.currentSpace?.name" @checkout="onCheckout" @close="isCheckoutOpen = false" />
    </QDialog>
  </div>
</template>

<style scoped lang="scss">
.refund_voucher {
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

  &_amount {
    font-size: 16px;
    font-weight: 500;
    text-align: end;
    vertical-align: middle;
    &--val {
      font-size: 24px;
    }
  }
  :deep(.q-card__section) {
    .recipe_detail {
      display: flex;
      gap: 16px;
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
