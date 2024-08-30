<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CheckTable, PaymentComposition } from '@/components/appointment';
import dayjs from 'dayjs';
import { PointTypes } from '@/const/general';
import { useQuasar } from 'quasar';
import { PaymentMethods } from '@/const/appointment';
import type { RefundDetail } from '@/views/order/point/RefundPoint.vue';
import { useRouter } from 'vue-router';
import { refundPoint } from '@/api';

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

const isCheckoutOpen = ref(false);
const payments = ref<Payments>([]);
const methodOptions = Object.values(PaymentMethods).filter(payment => payment.forPointAndGroup).map(({ label, identifier }) => ({ label, value: identifier }));

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

const $q = useQuasar();

const router = useRouter();
async function onCheckout() {
  const { clientId, clientGroupId, amount } = props.modelValue;
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
  await refundPoint({
    clientId,
    clientGroupId,
    amount,
    multiChannelPay,
  });

  $q.dialog({
    title: '退款已完成',
    message: '<div class="text-center q-pa-md"><span class="material-icons" style="color: #1D9E30; font-size: 64px">check_circle</span> <p class="q-y-sm">退款已完成，您可在「查詢交易紀錄」檢視此筆交易</p></div>',
    html: true,
    style: '480px',
    ok: {
      label: '我知道了',
      color: 'black',
      class: 'full-width',
    },
  }).onOk(() => {
    router.push({ name: 'transactionRecords' });
  },
  ).onCancel(() => {
    emit('finish');
  });
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
    <QDialog v-model="isCheckoutOpen">
      <QCard class="relative-position" style="width:500px">
        <QIcon v-close-popup name="close" color="black" class="cursor-pointer absolute-right no-print" size="24px" style="top: 16px; right: 16px; z-index:999" />
        <QCardSection class="row justify-center q-pa-md">
          <div class="text-h6 text-center">確認退款</div>
        </QCardSection>

        <QCardSection class="q-px-md q-py-lg justify-center q-py-sm">
          <div class="recipe_detail flex justify-center q-mb-md">
            <div class="text-h6 text-weight-regular">{{ modelValue.pointGroup?.name }} | {{ modelValue.pointGroup?.type ? PointTypes[modelValue.pointGroup?.type] : '' }}</div>
          </div>

          <div class="recipe_detail flex justify-center">
            <div>退款堂數 <span class="text-weight-medium q-mr-md text-h6">{{ modelValue.pointGroup?.points }} 堂</span></div>
            <div>退款金額 <span class="text-weight-medium text-h6"> $ {{ modelValue.amount }} 元</span></div>
          </div>
        </QCardSection>
        <QSeparator />
        <QCardActions class="q-pa-md">
          <QBtn label="取消" class="col-grow" outline @click="isCheckoutOpen = false" />
          <QBtn label="確認退款" class="col-grow" color="black" @click="onCheckout" />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
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
