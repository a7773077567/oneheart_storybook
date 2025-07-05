<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { CheckTable, CheckoutAction, PaymentComposition, Receipt } from '@/components/appointment';
import { usePointsStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { PointTypes } from '@/const/general';
import { gainPoint } from '@/api';
import { useQuasar } from 'quasar';
import { calcReceiptAmount } from '@/utils/helpers';
import { PaymentMethod, PaymentMethods } from '@/const/appointment';
import { POINTS_PLAN, pointUnit } from '@/const/points';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goBack'): void;
  (e: 'finish'): void;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];
type Payments = InstanceType<typeof PaymentComposition>['$props']['modelValue'];

const pointsStore = usePointsStore();
const userStore = useUserStore();
const isCheckoutOpen = ref(false);
const payments = ref<Payments>([]);
const methodOptions = Object.values(PaymentMethods).filter(({ forPointPurchasing }) => forPointPurchasing).map(({ label, identifier }) => ({ label, value: identifier }));

const purchaseDetail = computed<CheckTableData>(() => [
  { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
  { key: 'name', value: pointsStore.topupDetail?.clientName ?? '', label: '姓名' },
  { key: 'phone', value: pointsStore.topupDetail?.clientPhone ?? '', label: '電話' },
  { key: 'sellers', value: pointsStore.topupDetail.sellers?.length > 0 ? pointsStore.topupDetail.sellers.map(seller => seller.label).join(',') : '-', span: true, label: '負責人' },
  { key: 'chargersName', value: pointsStore.topupDetail.chargers?.length > 0 ? pointsStore.topupDetail.chargers.map(charger => charger.label).join(',') : '-', span: true, label: '銷售者' },
  { key: 'pointType', value: pointsStore.topupDetail.pointType && PointTypes[pointsStore.topupDetail.pointType], label: '類別' },
  { key: 'groupName', value: pointsStore.topupDetail?.groupName ?? '', label: '群組' },
  { key: 'plan', value: pointsStore.topupDetail?.plan ? POINTS_PLAN[pointsStore.topupDetail.plan].name : '', label: '方案' },
  { key: 'amount', value: `$ ${(pointsStore.topupDetail?.amount ?? 0)}`, label: '金額' },
  { key: 'paidPointGained', value: `${(pointsStore.topupDetail?.paidPointGained ?? 0)} ${pointUnit[pointsStore.topupDetail.pointType]}`, label: `${pointUnit[pointsStore.topupDetail.pointType]}數` },
  { key: 'giftPointGained', value: `${(pointsStore.topupDetail?.giftPointGained ?? 0)} ${pointUnit[pointsStore.topupDetail.pointType]}`, label: `贈送${pointUnit[pointsStore.topupDetail.pointType]}數` },
]);

const $q = useQuasar();
const receiptData = computed(() => {
  const { planName, paidPointGained, clientName, groupName, giftPointGained } = pointsStore.topupDetail;
  const { identityNumber, birthDate, gender } = pointsStore.targetClient ?? { identityNumber: '', birthDate: '', gender: '' };

  return [
    { name: 'name', label: '姓名', value: clientName },
    { name: 'gender', label: '性別', value: gender },
    { name: 'id', label: '身分證字號', value: identityNumber },
    { name: 'birthDate', label: '出生年月日', value: birthDate },
    { name: 'group', label: '群組', value: groupName },
    { name: 'amount', label: '金額', value: calcReceiptAmount(payments.value) },
    { name: 'planName', label: '方案', value: planName },
    { name: 'pointGained', label: `取得${pointUnit[pointsStore.topupDetail.pointType]}數`, value: paidPointGained },
    { name: 'giftPointGained', label: `贈送${pointUnit[pointsStore.topupDetail.pointType]}數`, value: giftPointGained },
  ];
});

const isProceeding = ref(false);
async function onCheckout() {
  const { clientId, clientGroupId, planName, paidPointGained, giftPointGained, amount, sellers, chargers,
    //  contractDottedsignTaskId #394 暫時移除簽約步驟
  } = pointsStore.topupDetail;
  const multiChannelPay = payments.value.map(({ payMethod, amount, authorisationCode, receiptNumber, details }) => {
    return { payMethod, amount, authorisationCode, receiptNumber, details };
  });

  const hasEmptyPayAmount = multiChannelPay.some(item => item.amount === undefined);
  if (hasEmptyPayAmount) {
    $q.dialog({
      message: '所有支付方式的金額皆需填入',
    });
    return;
  }
  // #394 暫時移除簽約步驟
  // if (!contractDottedsignTaskId) {
  //   $q.dialog({
  //     message: '合約尚未填寫完成',
  //   });
  // }
  isProceeding.value = true;
  try {
    await gainPoint({
      clientId,
      clientGroupId,
      plan: planName,
      paidPointGained,
      giftPointGained,
      amount,
      multiChannelPay,
      sellerIds: sellers?.map(seller => seller.value),
      chargerIds: chargers?.map(charger => charger.value),
      // contractDottedsignTaskId: `${contractDottedsignTaskId}`,
    });

    $q.dialog({
      message: '儲值成功',
    }).onOk(() => {
      isCheckoutOpen.value = false;
      emit('finish');
    },
    );
  }
  finally {
    isProceeding.value = false;
  }
}

// set amount to $0 when payment method is 堂數
watch(payments, (chosenPayments) => {
  const includePointPayment = chosenPayments.some(pay => pay.payMethod === PaymentMethod['堂數']);
  if (includePointPayment && pointsStore.topupDetail.amount !== 0) {
    pointsStore.topupDetail.amount = 0;
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
    <CheckoutAction v-model="pointsStore.topupDetail.amount" @checkout="isCheckoutOpen = true" />
    <PaymentComposition v-model="payments" :method-options="methodOptions" />

    <div class="q-my-lg">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="$emit('cancel')" />
      <QBtn color="black" size="md" label="上一步" class="q-px-lg" @click="$emit('goBack')" />
    </div>
    <QDialog v-model="isCheckoutOpen">
      <Receipt :rows="receiptData" payment-method="現金" :space-name="userStore?.currentSpace?.name" :space-id="userStore?.currentSpace?.id" :loading="isProceeding" @checkout="onCheckout" />
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
