<script setup lang='ts'>
import { ref } from 'vue';
import { QPagination, type QTableProps } from 'quasar';
import { PaymentTypes, PointTypes, ShiftType, TransactionTypes } from '@/const/general';
import { getPayments, getSinglePayment } from '@/api';
import type { MedicalPaymentRecord, PaymentQuery, PointsPaymentRecord, VoucherPaymentRecord } from '@/api';
import dayjs from 'dayjs';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { Receipt } from '@/components/appointment';
import { calcReceiptAmount, checkGender } from '@/utils/helpers';
import PaymentDetail from '@/components/order/PaymentDetail.vue';

type ReceiptData = InstanceType<typeof Receipt>['$props']['rows'];

const cols: QTableProps['columns'] = [
  {
    name: 'date',
    required: true,
    label: '日期',
    align: 'left',
    style: 'width:1px',
    field: row => row.date,
  },
  {
    name: 'spaceName',
    required: true,
    label: '場館',
    align: 'left',
    field: row => row.spaceName,
  },
  {
    name: 'clientId',
    required: true,
    label: '會員編號',
    align: 'left',
    field: row => row.clientId,
  },
  {
    name: 'type',
    required: true,
    label: '項目',
    align: 'left',
    field: row => TransactionTypes[row.type],
  },
  {
    name: 'clientName',
    required: true,
    label: '會員姓名',
    align: 'left',
    field: row => row.clientName,
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
          return voucher.length > 1 ? '複合式結帳' : PaymentTypes[voucher[0].payMethod];
        case TransactionTypes.點數交易:
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
    field: ({ type, amount, ticketGained, paidPointGained, giftPointGained }) => {
      switch (type) {
        case TransactionTypes.門診費用:
          return `$${amount}`;
        case TransactionTypes.團課券購買:
          return `${ticketGained} 張 / $${amount}`;
        case TransactionTypes.點數交易:
          return `${paidPointGained + giftPointGained} 堂/ $${amount}`;
        default:
          amount = 0;
      }
    },
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
  getRecordList(extractValidQuery({
    page: paging.value.modelValue,
    startDate: values?.date?.from,
    endDate: values?.date?.to,
    nameOrPhone: values.nameOrPhone ?? '',
  }));
});

async function getRecordList(query: Partial<PaymentQuery>) {
  const { data, meta } = await getPayments(extractValidQuery(query));
  rows.value = data;
  paging.value = { max: meta!.pageCount, modelValue: meta!.page };
}

function extractValidQuery(query: Partial<PaymentQuery>) {
  return {
    page: query.page ?? 1,
    startDate: query?.startDate ?? dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: query?.endDate ?? dayjs().endOf('month').format('YYYY-MM-DD'),
    ...(query.nameOrPhone ? { nameOrPhone: query.nameOrPhone } : {}),
  };
}

getRecordList({});
const receiptData = ref<ReceiptData>([]);
const isReceiptDialogOpen = ref(false);
const space = ref<string | undefined>();

async function checkReceipt(paymentId: number) {
  const { type, client, date, userShift, clientSchedulePaymentMultiChannelPay, groupClassTicketPaymentMultiChannelPay, pointPaymentMultiChannelPay, paidPointGained, giftPointGained, groupClassName, pointPaymentPlan, pointPaymentClientGroupName } = await getSinglePayment(paymentId);
  let amount = 0;
  let extraFields: InstanceType<typeof Receipt>['$props']['rows'] = [];
  switch (type) {
    case TransactionTypes.門診費用:
      amount = calcReceiptAmount(clientSchedulePaymentMultiChannelPay);
      extraFields = [{ name: 'amount', label: '總額', value: amount }, { name: 'declaration', label: '健保申報', value: '無' }, { name: 'selfPay', label: '自費項目', value: userShift?.type ? ShiftType[userShift.type] : '-' }, { name: 'userName', label: '治療師', value: userShift?.user?.name }, { name: 'date', label: '日期', value: date }];
      break;
    case TransactionTypes.團課券購買:
      amount = calcReceiptAmount(groupClassTicketPaymentMultiChannelPay);
      extraFields = [{ name: 'groupClassName', label: '課堂名稱', value: groupClassName }, { name: 'amount', label: '金額', value: amount }];
      break;
    case TransactionTypes.點數交易:
      amount = calcReceiptAmount(pointPaymentMultiChannelPay);
      extraFields = [{ name: 'group', label: '群組', value: pointPaymentClientGroupName }, { name: 'amount', label: '金額', value: amount }, { name: 'planName', label: '方案', value: pointPaymentPlan }, { name: 'pointGained', label: '取得點數', value: paidPointGained }, { name: 'giftPointGained', label: '贈送點數', value: giftPointGained }];
      break;
    default:
      amount = 0;
  }

  receiptData.value = [
    { name: 'name', label: '姓名', value: client.name },
    { name: 'gender', label: '性別', value: checkGender(client.identityNumber)?.label },
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

function onPrint() {
  window.print();
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
        @update:model-value="getRecordList({ page: $event, ...values.date, ...(values.nameOrPhone && { nameOrPhone: values.nameOrPhone }) })"
      />
    </div>
    <QTable :columns="cols" :rows="rows" row-key="id" separator="cell" hide-pagination class="no-shadow" :rows-per-page-options="[0]" bordered>
      <template #body-cell-attachment="{ value }">
        <QTd>
          <QBtn v-if="!!value" flat round icon="o_description" @click="checkReceipt(value)" />
          <span v-else>-</span>
        </QTd>
      </template>
      <template #body-cell-detail="{ value }">
        <QTd>
          <QBtn v-if="!!value" flat round icon="o_description" @click="checkPaymentDetail(value)" />
          <span v-else>-</span>
        </QTd>
      </template>
    </QTable>
    <QDialog v-model="isReceiptDialogOpen">
      <Receipt :rows="receiptData" :space-name="space" hide-checkout payment-method="現金" @print="onPrint" />
    </QDialog>
    <QDialog v-model="showDetail">
      <PaymentDetail :detail="targetPaymentDetails" />
    </QDialog>
  </div>
</template>
