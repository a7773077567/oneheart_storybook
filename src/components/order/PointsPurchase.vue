<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CheckTable, Receipt } from '@/components/appointment';
import { useClientStore, usePointsStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { PaymentTypes, PointTypes } from '@/const/general';
import { gainPoint } from '@/api';
import { useQuasar } from 'quasar';
import { checkGender } from '@/utils/helpers';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goBack'): void;
  (e: 'finish'): void;
}>();

type CheckTableData = InstanceType<typeof CheckTable>['$props']['data'];

const pointsStore = usePointsStore();
const userStore = useUserStore();
const clientStore = useClientStore();
const selectedPayment = ref<PaymentTypes>(PaymentTypes.現金);
const isCheckoutOpen = ref(false);

const purchaseDetail = computed<CheckTableData>(() => [
  { key: 'date', value: dayjs().format('YYYY-MM-DD'), span: true, custom: true },
  { key: 'name', value: pointsStore.topupDetail?.clientName ?? '', label: '姓名' },
  { key: 'phone', value: pointsStore.topupDetail?.clientPhone ?? '', label: '電話' },
  { key: 'pointType', value: PointTypes[pointsStore.topupDetail.pointType], label: '類別' },
  { key: 'groupName', value: pointsStore.topupDetail?.groupName ?? '', label: '群組' },
  { key: 'plan', value: pointsStore.topupDetail?.plan ?? '', label: '方案' },
  { key: 'amount', value: `$ ${(pointsStore.topupDetail?.amount ?? 0)}`, label: '金額' },
  { key: 'paidPointGained', value: `${(pointsStore.topupDetail?.paidPointGained ?? 0)} 堂`, label: '點堂' },
  { key: 'giftPointGained', value: `${(pointsStore.topupDetail?.giftPointGained ?? 0)} 堂`, label: '贈堂' },
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
  { key: 'amount', value: pointsStore.topupDetail?.amount, span: true, custom: true },
  { key: 'detailTitle', label: '付款明細', span: true, custom: true },
  { key: 'cashDetails', label: '現金', value: pointsStore.topupDetail?.amount, span: true, custom: true },
]);

const $q = useQuasar();
const receiptData = computed(() => {
  const { planName, paidPointGained, amount, clientName, groupName } = pointsStore.topupDetail;
  const { identityNumber, birthDate } = clientStore.targetClient!;

  return [
    { name: 'name', label: '姓名', value: clientName },
    { name: 'gender', label: '性別', value: checkGender(identityNumber)?.label },
    { name: 'id', label: '身分證字號', value: identityNumber },
    { name: 'birthDate', label: '出生年月日', value: birthDate },
    { name: 'group', label: '群組', value: groupName },
    { name: 'amount', label: '金額', value: amount },
    { name: 'planName', label: '方案', value: planName },
    { name: 'pointGained', label: '點數', value: paidPointGained },
    { name: 'paymentMethod', label: '付款方式', value: '現金' },
  ];
});

async function onCheckout() {
  const { clientId, clientGroupId, planName, paidPointGained, giftPointGained, amount } = pointsStore.topupDetail;

  await gainPoint({
    clientId,
    clientGroupId,
    plan: planName,
    paidPointGained,
    giftPointGained,
    amount,
    payMethod: selectedPayment.value,
    authorisationCode: null, // todo, 複合式結帳時需修改
    receiptNumber: null, // todo, 複合式結帳時需修改
  });

  // todo 顯示收據
  $q.dialog({
    message: '儲值成功',
  }).onOk(() =>
    emit('finish'),
  );
}

function onPrint() {
  window.print();
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
          <QBtn label="結帳" outline style="width: 125px; font-size: 16px" @click="isCheckoutOpen = true" />
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
    <QDialog v-model="isCheckoutOpen">
      <Receipt :rows="receiptData" payment-method="現金" :space-name="userStore?.currentSpace?.name" @print="onPrint" @checkout="onCheckout" />
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
