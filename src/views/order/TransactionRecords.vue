<script setup lang='ts'>
import { computed, ref } from 'vue';
import { QPagination, type QTableProps } from 'quasar';
import { PaymentTypes, ShiftType, TransactionTypes } from '@/const/general';
import { type PaymentQuery, getPayments, getSinglePayment } from '@/api';
import dayjs from 'dayjs';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { Receipt } from '@/components/appointment';
import { checkGender } from '@/utils/helpers';

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
    field: row => PaymentTypes[row.payMethod],
  },
  {
    name: 'amount',
    required: true,
    label: '金額/點數',
    align: 'left',
    field: (row) => {
      switch (row.type) {
        case TransactionTypes.門診費用:
          return row.payMethod === PaymentTypes.點數 ? `${row.usedPoint} 點` : `$ ${row.amount}`;
        case TransactionTypes.團課券購買:
          return row.usedGroupClassTicket ? `${row.usedGroupClassTicket}張` : '-';
        case TransactionTypes.點數交易:
        default:
          return `$ ${row.amount}`;
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
];

const rows = ref();
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
  paging.value = { max: meta.pageCount, modelValue: meta.page };
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
const paymentMethod = ref<number | undefined>();

async function checkReceipt(paymentId: number) {
  const { client, amount, date, userShift, spaceName, usedPoint, payMethod } = await getSinglePayment(paymentId);
  space.value = spaceName;
  paymentMethod.value = +payMethod;
  receiptData.value = [
    { name: 'name', label: '姓名', value: client.name },
    { name: 'gender', label: '性別', value: checkGender(client.identityNumber)?.label },
    { name: 'id', label: '身分證字號', value: client.identityNumber },
    { name: 'birthDate', label: '出生年月日', value: client.birthDate },
    { name: 'amount', label: '總額', value: amount },
    { name: 'declaration', label: '健保申報', value: '無' },
    { name: 'selfPay', label: '自費項目', value: ShiftType[userShift?.type] },
    { name: 'userName', label: '治療師', value: userShift?.user?.name },
    { name: 'points', label: '點數', value: usedPoint },
    { name: 'date', label: '日期', value: date },
  ];

  // receiptData.value = {
  //   name: client.name,
  //   gender: checkGender(client.identityNumber)?.label,
  //   id: client.identityNumber,
  //   birthDate: client.birthDate,
  //   declaration: '無',
  //   selfPay: ShiftType[userShift.type],
  //   date,
  //   userName: userShift?.user?.name,
  //   amount,
  //   points: usedPoint,
  // };
  isReceiptDialogOpen.value = true;
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
    </QTable>
    <QDialog v-model="isReceiptDialogOpen">
      <Receipt :rows="receiptData" :space-name="space" hide-checkout payment-method="現金" @print="onPrint" />
    </QDialog>
  </div>
</template>
