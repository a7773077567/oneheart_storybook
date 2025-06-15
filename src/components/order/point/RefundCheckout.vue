<script setup lang='ts'>
import { computed, h, nextTick, ref } from 'vue';
import { CheckTable, PaymentComposition, Receipt } from '@/components/appointment';
import dayjs from 'dayjs';
import { PointTypes } from '@/const/general';
import { useQuasar } from 'quasar';
import { PaymentMethods } from '@/const/appointment';
import type { RefundDetail } from '@/views/order/point/RefundPoint.vue';
import { useRouter } from 'vue-router';
import { refundByPointPlan } from '@/api';
import { useUserStore } from '@/stores';
import { calcReceiptAmount } from '@/utils/helpers';
import { useDialog } from '@/composables/dialog';
import { pointUnit } from '@/const/points';

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
  const { client, pointGroup, pointPayment } = props.modelValue;
  return [
    { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
    { key: 'name', value: client?.name ?? '', label: '姓名' },
    { key: 'phone', value: client?.phone ?? '', label: '電話' },
    { key: 'sellers', value: pointPayment?.sellers && pointPayment.sellers.length > 0 ? pointPayment?.sellers?.map(seller => seller.name).join(',') : '-', span: true, label: '負責人' },
    { key: 'chargersName', value: pointPayment?.chargers && pointPayment.chargers?.length > 0 ? pointPayment?.chargers?.map(charger => charger.name).join(',') : '-', span: true, label: '銷售者' },
    { key: 'pointType', value: pointGroup?.type ? PointTypes[pointGroup.type] : '', label: '類別' },
    { key: 'groupName', value: pointGroup?.name ?? '', label: '群組' },
    { key: 'plan', value: pointPayment?.plan ?? '', label: '退款方案' },
    { key: 'groupName', value: `$${props.modelValue.amount ?? 0}`, label: '退款金額' },
    { key: 'classCounts', value: `${pointPayment?.useAblePoints ?? 0} ${pointUnit[pointGroup?.type ?? PointTypes['物理治療']]}`, label: '退款堂數' },
  ];
});

// receipt
const receiptData = computed(() => {
  const { client, pointGroup, pointPayment } = props.modelValue;
  return [
    { name: 'name', label: '姓名', value: client?.name ?? '' },
    { name: 'gender', label: '性別', value: client?.gender ?? '' },
    { name: 'id', label: '身分證字號', value: client?.identityNumber ?? '' },
    { name: 'birthDate', label: '出生年月日', value: client?.birthDate ?? '' },
    { name: 'group', label: '群組', value: pointGroup?.name ?? '' },
    { name: 'amount', label: '金額', value: `$${calcReceiptAmount(payments.value)}` },
    { name: 'pointGained', label: `退款${pointUnit[pointGroup?.type ?? PointTypes['物理治療']]}數`, value: `${pointPayment?.useAblePoints ?? 0}${pointUnit[pointGroup?.type ?? PointTypes['物理治療']]}` },
  ];
});

const $q = useQuasar();
const router = useRouter();
const isRefunding = ref(false);
async function onCheckout() {
  const { clientId, clientGroupId, amount, pointPaymentId } = props.modelValue;
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
    await refundByPointPlan({
      clientId,
      clientGroupId,
      amount,
      multiChannelPay,
      pointPaymentId,
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
      // open the receipt in a new page to get the full-page print layout
        const printContents = document.querySelector('.receipt')!.innerHTML;
        localStorage.setItem('printData', JSON.stringify(printContents));
        window.open(router.resolve({ name: 'receiptPrint' }).href, '_black');

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
      退款總額 &nbsp;<span class="refund_point_amount--val">${{ modelValue.amount }} 元</span>
    </div>
    <PaymentComposition v-model="payments" :method-options="methodOptions" />

    <div class="q-my-lg">
      <QBtn outline size="md" label="返回上一步" class="q-px-lg q-mr-md" @click="$emit('goBack')" />
      <QBtn color="red" size="md" label="確認退款結帳" class="q-px-lg" @click="isCheckoutOpen = true" />
    </div>
  </div>
  <QDialog v-model="isCheckoutOpen">
    <Receipt hide-print :rows="receiptData" payment-method="現金" :space-name="userStore?.currentSpace?.name" :space-id="userStore?.currentSpace?.id" :loading="isRefunding" @checkout="onCheckout" @close="isCheckoutOpen = false" />
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
