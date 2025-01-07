<script setup lang='ts'>
import { ref, watch } from 'vue';
import { QPagination, type QTableProps } from 'quasar';
import type { PointTypes } from '@/const/general';
import { PaymentTypes, ShiftType, TransactionTypes } from '@/const/general';
import { deletePayment, getPayments, getSinglePayment } from '@/api';
import type { MedicalPaymentRecord, PointsPaymentRecord, VoucherPaymentRecord } from '@/api';
import dayjs from 'dayjs';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { Receipt } from '@/components/appointment';
import { calcReceiptAmount, checkGender, showDecimal } from '@/utils/helpers';
import PaymentDetail from '@/components/order/PaymentDetail.vue';
import CancelOrder from '@/components/order/CancelOrder.vue';
import { Space } from '@/const/space';
import { pointUnit } from '@/const/points';

type ReceiptData = InstanceType<typeof Receipt>['$props']['rows'];

const cols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    style: row => `width:1px; ${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: row => row.date,
  },
  {
    name: 'spaceName',
    required: true,
    label: '場館',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: row => row.spaceName,
  },
  {
    name: 'clientId',
    required: true,
    label: '會員編號',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: row => row.clientId,
  },
  {
    name: 'type',
    required: true,
    label: '項目',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: row => TransactionTypes[row.type],
  },
  {
    name: 'clientName',
    required: true,
    label: '會員姓名',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
    field: row => row.clientName,
  },
  {
    name: 'payMethod',
    required: true,
    label: '支付方式',
    align: 'left',
    style: row => `${row.isDeleted ? 'opacity: 0.4' : ''}`,
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
    name: 'cancel',
    required: true,
    label: '刪除交易(門診)',
    align: 'left',
    field: row => row.isDeleted,
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

const rows = ref<(MedicalPaymentRecord | PointsPaymentRecord | VoucherPaymentRecord)[]>([]);
const paging = ref<QPagination['$props']>({
  max: 1,
  modelValue: 1,
});

const schema = z.object({
  date: z.object({ from: z.string(), to: z.string() }),
  nameOrPhone: z.string().nullable().optional(),
});

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    date: {
      from: dayjs().startOf('month').format('YYYY-MM-DD'),
      to: dayjs().endOf('month').format('YYYY-MM-DD'),
    },
  },
});

const onSubmit = handleSubmit((values) => {
  getRecordList({
    page: 1, // 重新從第一頁搜尋
    date: values.date,
    nameOrPhone: values.nameOrPhone ?? '',
  });
});

type Query = z.infer<typeof schema> & { page: number };
async function getRecordList(query: Query) {
  const _query = {
    page: query.page ?? 1,
    startDate: query.date.from,
    endDate: query.date.to,
    ...(query.nameOrPhone ? { nameOrPhone: query.nameOrPhone } : {}),
  };
  const { data, meta } = await getPayments(_query);
  rows.value = data;

  paging.value = { max: meta!.pageCount, modelValue: meta!.page };
}

watch(() => paging.value.modelValue, async (page) => {
  getRecordList({ page, date: values.date as Query['date'], ...(values.nameOrPhone && { nameOrPhone: values.nameOrPhone }) });
});

getRecordList({
  page: 1,
  date: { from: dayjs().startOf('month').format('YYYY-MM-DD'), to: dayjs().endOf('month').format('YYYY-MM-DD') },
});

// receipt
const receiptData = ref<ReceiptData>([]);
const isReceiptDialogOpen = ref(false);
const space = ref<string>('');

async function checkReceipt(paymentId: number) {
  const { type, client, date, userShift, clientSchedulePaymentMultiChannelPay, groupClassTicketPaymentMultiChannelPay, pointPaymentMultiChannelPay, paidPointGained, giftPointGained, groupClassName, pointPaymentPlan, pointPaymentClientGroupName, ticketGained, spaceName, pointPaymentClientGroupType } = await getSinglePayment(paymentId);
  space.value = spaceName!;
  let amount = 0;
  let extraFields: InstanceType<typeof Receipt>['$props']['rows'] = [];
  switch (type) {
    case TransactionTypes.門診費用:
      amount = calcReceiptAmount(clientSchedulePaymentMultiChannelPay);
      extraFields = [{ name: 'amount', label: '總額', value: `$${amount}` }, { name: 'declaration', label: '健保申報', value: '無' }, { name: 'selfPay', label: '自費項目', value: userShift?.type ? ShiftType[userShift.type] : '-' }, { name: 'userName', label: '治療師', value: userShift?.user?.name }, { name: 'date', label: '日期', value: date }];
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
    { name: 'gender', label: '性別', value: checkGender(client.identityNumber, client.identityType!)?.label },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    ...extraFields,
  ];

  isReceiptDialogOpen.value = true;
}

const targetPaymentDetails = ref<InstanceType<typeof PaymentDetail>['$props']['detail']>({} as any);
const showDetail = ref(false);

async function checkPaymentDetail(val: any) {
  showDetail.value = true;
  targetPaymentDetails.value = val;
  const data = await getSinglePayment(val.id);
  targetPaymentDetails.value = { ...targetPaymentDetails.value, ...data };
}

const showCancelConfirm = ref(false);
const cancelDetail = ref();

function openCancelConfirm(data: (typeof rows.value)[number]) {
  const { amount, clientId, clientName, date, id } = data;
  cancelDetail.value = { amount, clientId, clientName, date, id };
  showCancelConfirm.value = true;
}

async function cancelTransaction() {
  if (!cancelDetail.value.id)
    return;

  await deletePayment(cancelDetail.value.id);
  await getRecordList({
    page: paging.value.modelValue, // 重新從第一頁搜尋
    date: values.date as Query['date'],
    nameOrPhone: values.nameOrPhone ?? '',
  });
  showCancelConfirm.value = false;
}
</script>

<template>
  <div class="transaction_records_page q-py-sm">
    <div class="row q-col-gutter-md items-center" style="max-width: 860px">
      <InputBox label="" class="col-xs-12 col-sm-5">
        <OInput name="nameOrPhone" rounded dense hide-bottom-space placeholder="請輸入客戶名稱或電話" clearable />
      </InputBox>
      <InputBox label="" class="col-xs-12 col-sm-5">
        <DatePicker name="date" range />
      </InputBox>
      <div class="col-2">
        <QBtn outline label="搜尋" @click="onSubmit" />
      </div>
    </div>
    <div class="flex justify-end q-py-md">
      <QPagination
        v-model="paging.modelValue"
        :max="paging.max"
        input
      />
    </div>
    <QTable :columns="cols" :rows="rows" row-key="id" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-cancel="{ value, row }">
        <QTd class="text-center">
          <template v-if="row.type === TransactionTypes['門診費用']">
            <span v-if="!!value">已刪除</span>
            <QBtn v-else flat color="blue" label="刪除交易" @click="openCancelConfirm(row)" />
          </template>
        </QTd>
      </template>
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
    <QDialog v-model="isReceiptDialogOpen">
      <Receipt :rows="receiptData" :space-name="space" :space-id="Space[space as keyof typeof Space]" hide-checkout payment-method="現金" />
    </QDialog>
    <QDialog v-model="showDetail">
      <PaymentDetail :detail="targetPaymentDetails" />
    </QDialog>
    <QDialog v-model="showCancelConfirm">
      <CancelOrder :data="cancelDetail" @cancel="showCancelConfirm = false" @confirm="cancelTransaction" />
    </QDialog>
  </div>
</template>
