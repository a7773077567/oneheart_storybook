<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QSeparator } from 'quasar';
import { PTLevel, type PersonalRevenueDetail, type PersonalRevenueOverview, getPersonalRevenueStatsList, getPersonalRevenueStatsOverview, getSinglePayment } from '@/api';
import { useRoute } from 'vue-router';
import { getMonthDifference } from '@/utils/date';
import type { QTableProps } from 'quasar';
import PaymentDetail from '@/components/order/PaymentDetail.vue';
import RuleList from '@/components/home/dashboard/RuleList.vue';
import { AddOnServiceTypes, PaymentTypes, ShiftType, TransactionTypes } from '@/const/general';
import { calcReceiptAmount, formatPriceWithComma, showDecimal } from '@/utils/helpers';
import { pointUnit } from '@/const/points';
import type { PointTypes } from '@/const/general';
import { Receipt } from '@/components/appointment';
import { Space } from '@/const/space';

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const overview = ref<PersonalRevenueOverview>({} as PersonalRevenueOverview);
const ruleList = computed(() => overview.value.rules.map(rule => ({ ...rule, min: rule.min && `$${formatPriceWithComma(rule.min)}`, max: rule.max && `$${formatPriceWithComma(rule.max)}` })));

const scoreCols: QTableProps['columns'] = [
  {
    name: 'month',
    label: '月份',
    field: 'month',
    align: 'left',
    format: (val: number, row) => getMonthDifference(row.year, val) === 0 ? `${row.year} / ${val} (本月)` : `${row.year} / ${val}`,
    headerStyle: 'font-size: 14px',
  },
  {
    name: 'revenue',
    required: true,
    label: '營業額',
    field: 'revenue',
    format: val => `$${formatPriceWithComma(val)}`,
    headerStyle: 'font-size: 14px',
    align: 'left',
  },
  {
    name: 'points',
    required: true,
    label: '得分',
    field: 'points',
    format: val => `${val} 分`,
    headerStyle: 'font-size: 14px',
  },
];

const scoreList = computed(() => overview.value.detailList.map(item => ({ ...item, diff: getMonthDifference(item.year, item.month) })));
const previous3Scores = computed(() => scoreList.value.filter(item => item.diff > 0 && item.diff <= 3).map(month => month.points));
const recent3Scores = computed(() => scoreList.value.filter(item => item.diff >= 0 && item.diff <= 2).map(month => month.points));

// revenue detail
const revenueDetailTable = ref<PersonalRevenueDetail[]>([]); // Ensure PersonalRevenueDetail is correctly imported and defined
const revenueDetailCols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    field: 'date',
  },
  {
    name: 'spaceName',
    required: true,
    label: '場館',
    align: 'left',
    field: 'spaceName',
  },
  {
    name: 'id',
    required: true,
    label: '客戶編號',
    align: 'left',
    field: 'id',
  },
  {
    name: 'type',
    required: true,
    label: '項目',
    align: 'left',
    field: 'type',
    format: val => TransactionTypes[val],
    style: val => val === TransactionTypes['團課券退款'] || val === TransactionTypes['堂數退款'] ? 'color: rgba(194, 53, 26, 1)' : 'text: rgba(26, 27, 33, 1)',
  },
  {
    name: 'clientName',
    required: true,
    label: '會員姓名',
    align: 'left',
    field: 'clientName',
  },
  {
    name: 'payMethod',
    required: true,
    label: '支付方式',
    align: 'left',
    field: ({ type, clientSchedulePaymentMultiChannelPay: Medical, groupClassTicketPaymentMultiChannelPay: voucher, pointPaymentMultiChannelPay: point }) => {
      switch (type) {
        case TransactionTypes.門診費用:
          return Medical.length > 1 ? '複合式結帳' : PaymentTypes[Medical[0].payMethod];
        case TransactionTypes.團課券購買:
        case TransactionTypes.團課券退款:
          return voucher.length > 1 ? '複合式結帳' : PaymentTypes[voucher[0].payMethod];
        case TransactionTypes.堂數交易:
        case TransactionTypes.堂數退款:
          return point.length > 1 ? '複合式結帳' : PaymentTypes[point[0].payMethod];
        default:
          return '';
      }
    },
  },
  {
    name: 'amount',
    required: true,
    label: '堂(張)數 / 金額',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: ({ type, amount, ticketGained, paidPointGained, giftPointGained, pointPaymentClientGroupType }) => {
      switch (type) {
        case TransactionTypes.門診費用:
          return `$${amount}`;
        case TransactionTypes.團課券購買:
          return `${ticketGained} 張 / $${amount}`;
        case TransactionTypes.團課券退款:
          return `${ticketGained} 張 / $ -${amount}`;
        case TransactionTypes.堂數交易:
          return `${showDecimal(+paidPointGained + +giftPointGained)} ${pointUnit[pointPaymentClientGroupType as PointTypes]}/ $${amount}`;
        case TransactionTypes.堂數退款:
          return `${showDecimal(+paidPointGained + +giftPointGained)} ${pointUnit[pointPaymentClientGroupType as PointTypes]}/ $ -${amount}`;
        default:
          amount = 0;
      }
    },
  },
  {
    name: 'seller',
    required: true,
    label: '銷售者',
    align: 'left',
    field: row => row.seller?.name ?? '-',
  },
  {
    name: 'attachment',
    required: true,
    label: '收據',
    align: 'left',
    field: row => row.id,
  },
  {
    name: 'detail',
    required: true,
    label: '明細',
    align: 'left',
    field: row => row,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

async function getReferralClientList() {
  const { data, meta } = await getPersonalRevenueStatsList({
    userId: +userId.value,
    page: pagination.value.page ?? 1,
    take: pagination.value.rowsPerPage,
  });
  revenueDetailTable.value = data;
  pagination.value = {
    page: meta?.page ?? 1,
    rowsNumber: meta?.itemCount ?? 0,
    rowsPerPage: meta?.take ?? 10,
  };
}
const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage } = props.pagination;

  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  getReferralClientList();
};

// receipt
type ReceiptData = InstanceType<typeof Receipt>['$props']['rows'];
const receiptData = ref<ReceiptData>([]);
const isReceiptDialogOpen = ref(false);
const space = ref<string>('');

async function checkReceipt(paymentId: number) {
  const data = await getSinglePayment(paymentId);
  const { type, client, date, userShift, clientSchedulePaymentMultiChannelPay, groupClassTicketPaymentMultiChannelPay, pointPaymentMultiChannelPay, paidPointGained, giftPointGained, groupClassName, pointPaymentPlan, pointPaymentClientGroupName, ticketGained, spaceName, pointPaymentClientGroupType } = data;
  space.value = spaceName!;
  let amount = 0;
  let extraFields: InstanceType<typeof Receipt>['$props']['rows'] = [];

  switch (type) {
    case TransactionTypes.門診費用:{
      const addOnList = data.addOnServices.filter(addOn => addOn.isAddOn);
      amount = calcReceiptAmount(clientSchedulePaymentMultiChannelPay);
      extraFields = [
        { name: 'amount', label: '總額', value: `$${amount}` },
        { name: 'declaration', label: '健保申報', value: '無' },
        { name: 'selfPay', label: '自費項目', value: userShift?.type ? ShiftType[userShift.type] : '-' },
        { name: 'userName', label: '治療師', value: userShift?.user?.name },
        { name: 'date', label: '日期', value: date },
        ...(addOnList.length > 0 ? [{ name: 'addOn', label: '加購服務', value: addOnList.map(a => a?.serviceName).join('、') }] : []),
        ...(addOnList.some(addOn => addOn.serviceType === AddOnServiceTypes['震波']) ? [{ name: 'addOnServiceShockWaveShots', label: '加購發數', value: `${data?.record?.addOnServiceShockWaveShots ?? 0}發` }] : []),
        ...(!!userShift && userShift.type === ShiftType['震波'] ? [{ name: 'independentShockWaveShots', label: '發數', value: `${data?.record?.independentShockWaveShots ?? 0}發` }] : []),
      ];
    }
      break;
    case TransactionTypes.團課券購買:
      amount = calcReceiptAmount(groupClassTicketPaymentMultiChannelPay);
      extraFields = [{ name: 'groupClassName', label: '課程名稱', value: groupClassName }, { name: 'amount', label: '金額', value: `$${amount}` }, { name: 'pointGained', label: '張數', value: `${ticketGained ?? 0}張` }];
      break;
    case TransactionTypes.團課券退款:
      amount = calcReceiptAmount(groupClassTicketPaymentMultiChannelPay);
      extraFields = [{ name: 'groupClassName', label: '課程名稱', value: groupClassName }, { name: 'amount', label: '金額', value: `-$${amount}` }, { name: 'pointGained', label: '張數', value: `${ticketGained ?? 0}張` }];
      break;
    case TransactionTypes.堂數交易:
      amount = calcReceiptAmount(pointPaymentMultiChannelPay);
      extraFields = [{ name: 'group', label: '群組', value: pointPaymentClientGroupName }, { name: 'amount', label: '金額', value: `$${amount}` }, { name: 'planName', label: '方案', value: pointPaymentPlan }, { name: 'pointGained', label: `取得${pointUnit[pointPaymentClientGroupType as PointTypes]}數`, value: `${paidPointGained}${pointUnit[pointPaymentClientGroupType as PointTypes]}` }, { name: 'giftPointGained', label: `贈送${pointUnit[pointPaymentClientGroupType as PointTypes]}數`, value: `${giftPointGained}${pointUnit[pointPaymentClientGroupType as PointTypes]}` }];
      break;
    case TransactionTypes.堂數退款:
      amount = calcReceiptAmount(pointPaymentMultiChannelPay);
      extraFields = [{ name: 'group', label: '群組', value: pointPaymentClientGroupName }, { name: 'amount', label: '金額', value: `-$${amount}` }, { name: 'planName', label: '方案', value: pointPaymentPlan }, { name: 'pointGained', label: `${pointUnit[pointPaymentClientGroupType as PointTypes]}數`, value: `${showDecimal(+paidPointGained + +giftPointGained)}${pointUnit[pointPaymentClientGroupType as PointTypes]}` }];
      break;
    default:
      amount = 0;
  }

  receiptData.value = [
    { name: 'name', label: '姓名', value: client.name },
    { name: 'gender', label: '性別', value: client.gender },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    ...extraFields,
  ];

  isReceiptDialogOpen.value = true;
}

const targetPaymentDetails = ref<InstanceType<typeof PaymentDetail>['$props']['detail']>({} as any);
const showDetail = ref(false);

async function checkPaymentDetail(val: any) {
  targetPaymentDetails.value = val;
  const data = await getSinglePayment(val.id);
  targetPaymentDetails.value = { ...targetPaymentDetails.value, ...data };
  showDetail.value = true;
}

await Promise.all([
  getPersonalRevenueStatsOverview({ userId: +userId.value }),
  getReferralClientList(),
]).then(([data]) => {
  overview.value = data;
});
</script>

<template>
  <div class="personal_revenue_detail">
    <h2 class="text-headline-medium text-on-surface">個人營業額計分詳情</h2>
    <h3 class="text-title-large text-on-surface">計分說明</h3>
    <p class="text-title-small text-on-surface">預約結帳與堂數營業額。計算「完成結帳」的總金額，並扣除折扣項目。</p>
    <QSeparator style="margin: 32px 0" />
    <h3 class="text-title-large text-on-surface">計分明細</h3>
    <div class="row no-wrap">
      <section class="col-7">
        <QTable
          flat
          :rows="overview.detailList"
          :columns="scoreCols"
          row-key="index"
          virtual-scroll
          :rows-per-page-options="[0]"
          hide-pagination
        />
        <QSeparator class="q-mb-md" />
        <div class="score_calculation row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <span class="text-body-medium-highlight">計分方式</span>
            <p class="text-body-medium-highlight">三個月平均得分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">前三個月 ({{ previous3Scores.join('+') }} ) / 3</p>
            <p class="text-title-medium text-right">目前得分 {{ overview.currentPoint }} 分</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-body-medium text-on-surface q-mb-sm text-right">近三個月 ({{ recent3Scores.join('+') }}) / 3</p>
            <p class="text-title-medium text-right">預測得分 {{ overview.predictionPoint }} 分</p>
          </div>
        </div>
      </section>
      <QSeparator style="margin:0 24px" vertical />
      <section class="col-4">
        <h4 class="text-label-large-perminent text-on-surface q-mb-sm">得分標準</h4>
        <p class="text-body-medium text-on-surface q-mb-sm">您本月職階為 {{ PTLevel[overview.currentPTLevel] }}<template v-if="overview.currentPTLevel !== PTLevel['PT院長']">，得分標準如下：</template></p>
        <RuleList v-if="overview.currentPTLevel !== PTLevel['PT院長']" :rules="ruleList" class="q-mb-sm" label="營業額" />
        <p class="text-body-medium text-on-surface q-mb-sm">*職階由管理者設定，每月可能變動</p>
      </section>
    </div>
    <QSeparator style="margin:32px 0" />
    <section>
      <h3 class="text-title-large text-on-surface">營業額交易明細</h3>
      <p class="text-title-small q-mb-md">以下為近 4 個月內影響得分的營業額明細。</p>

      <QTable
        v-model:pagination="pagination"
        flat
        :rows="revenueDetailTable"
        :columns="revenueDetailCols"
        row-key="clientId"
        virtual-scroll
        rows-per-page-label="每頁顯示筆數"
        :rows-per-page-options="[1, 10, 20, 50]"
        @request="onRequest"
      >
        <template #body-cell-attachment="{ value }">
          <QTd class="text-center">
            <QBtn v-if="!!value" flat round icon="o_receipt_long" @click="checkReceipt(value)" />
            <span v-else>-</span>
          </QTd>
        </template>
        <template #body-cell-detail="{ value }">
          <QTd>
            <QBtn v-if="!!value" flat round icon="o_article" @click="checkPaymentDetail(value)" />
            <span v-else>-</span>
          </QTd>
        </template>
      </QTable>
    </section>
    <QDialog v-model="isReceiptDialogOpen">
      <Receipt :rows="receiptData" :space-name="space" :space-id="Space[space as keyof typeof Space]" hide-checkout payment-method="現金" />
    </QDialog>
    <QDialog v-model="showDetail">
      <PaymentDetail :detail="targetPaymentDetails" />
    </QDialog>
  </div>
</template>

<style scoped lang="scss">
.personal_revenue_detail {
  h2 {
    padding: 18px 0;
    margin-bottom: 24px;
  }
  h3 {
    margin-bottom: 16px;
  }
}
</style>
