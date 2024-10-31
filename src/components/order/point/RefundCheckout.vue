<script setup lang='ts'>
import { computed, h, nextTick, ref } from 'vue';
import { CheckTable, PaymentComposition, Receipt } from '@/components/appointment';
import dayjs from 'dayjs';
import { PointTypes } from '@/const/general';
import { useQuasar } from 'quasar';
import { PaymentMethods } from '@/const/appointment';
import type { RefundDetail } from '@/views/order/point/RefundPoint.vue';
import { useRouter } from 'vue-router';
import { refundPoint } from '@/api';
import { useUserStore } from '@/stores';
import { calcReceiptAmount } from '@/utils/helpers';
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
const methodOptions = Object.values(PaymentMethods).filter(payment => payment.forRefunding).map(({ label, identifier }) => ({ label, value: identifier }));

const refundDetail = computed<CheckTableData>(() => {
  const { client, pointGroup } = props.modelValue;
  return [
    { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
    { key: 'name', value: client?.name ?? '', label: '姓名' },
    { key: 'phone', value: client?.phone ?? '', label: '電話' },
    { key: 'pointType', value: pointGroup?.type ? PointTypes[pointGroup.type] : '', label: '類別' },
    { key: 'groupName', value: pointGroup?.name ?? '', label: '群組' },
    { key: 'classCounts', value: `${pointGroup?.points ?? 0} 堂`, label: '堂數' },
  ];
});

// receipt
const receiptData = computed(() => {
  const { client, pointGroup } = props.modelValue;
  return [
    { name: 'name', label: '姓名', value: client?.name ?? '' },
    { name: 'gender', label: '性別', value: client?.gender ?? '' },
    { name: 'id', label: '身分證字號', value: client?.identityNumber ?? '' },
    { name: 'birthDate', label: '出生年月日', value: client?.birthDate ?? '' },
    { name: 'group', label: '群組', value: pointGroup?.name ?? '' },
    { name: 'amount', label: '金額', value: `$${calcReceiptAmount(payments.value)}` },
    { name: 'pointGained', label: '退款堂數', value: `${pointGroup?.points ?? 0}堂` },
  ];
});

const $q = useQuasar();
const router = useRouter();
const isRefunding = ref(false);
async function onCheckout() {
  const { clientId, clientGroupId, amount } = props.modelValue;
  const multiChannelPay = payments.value.map(({ payMethod, amount, authorisationCode, receiptNumber, details }) => {
    return { payMethod, amount, authorisationCode, receiptNumber, details };
  });
  // accept $0 refund
  const hasEmptyPayAmount = multiChannelPay.some(item => !item.amount);
  if (amount !== 0 && hasEmptyPayAmount) {
    $q.dialog({
      message: '所有支付方式的金額皆需填入',
    });
    return;
  }
  isRefunding.value = true;
  try {
    await refundPoint({
      clientId,
      clientGroupId,
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
      nextTick(() => {
      // after success dialog close then do the print
        window.print();
        emit('finish');
      });
    },
    );
    onCancel(() => {
      router.push({ name: 'transactionRecords' });
    });
  }
  finally {
    isRefunding.value = false;
  };
}
</script>

<template>
  <div class="refund_point">
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
  </div>
  <QDialog v-model="isCheckoutOpen">
    <Receipt hide-print :rows="receiptData" payment-method="現金" :space-name="userStore?.currentSpace?.name" :loading="isRefunding" @checkout="onCheckout" @close="isCheckoutOpen = false" />
  </QDialog>
</template>

<style scoped lang="scss">
.refund_point {
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
      gap: 16px;
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
