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

type ReceiptData = InstanceType<typeof Receipt>['$props']['data'];

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
        case TransactionTypes.商品購買:
          return row.payMethod === PaymentTypes.點數 ? `${row.usedPoint} 點` : `$ ${row.amount}`;

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
  name: z.string().optional(),
});
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    date: {
      from: dayjs().format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
  },
});

const onSubmit = handleSubmit((values) => {
  getRecordList({
    page: paging.value.modelValue,
    startDate: values?.date?.from ?? dayjs().format('YYYY-MM-DD'),
    endDate: values?.date?.to ?? dayjs().format('YYYY-MM-DD'),
    ...(values.name ? { name: values.name } : {}),
  });
});

async function getRecordList(query: Partial<PaymentQuery>) {
  const { data, meta } = await getPayments({
    page: 1,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    ...query,
  });
  rows.value = data;
  paging.value = { max: meta.pageCount, modelValue: meta.page };
}

getRecordList({});
const receiptData = ref<ReceiptData | undefined>();
const isReceiptDialogOpen = ref(false);
const space = ref<string | undefined>();
const paymentMethod = ref<number | undefined>();

async function checkReceipt(paymentId: number) {
  const { client, amount, date, userShift, spaceName, usedPoint, payMethod } = await getSinglePayment(paymentId);
  space.value = spaceName;
  paymentMethod.value = +payMethod;
  receiptData.value = {
    name: client.name,
    gender: checkGender(client.identityNumber)?.label,
    id: client.identityNumber,
    birthDate: client.birthDate,
    declaration: '無',
    selfPay: ShiftType[userShift.type],
    date,
    userName: userShift?.user?.name,
    amount,
    points: usedPoint,
  };
  isReceiptDialogOpen.value = true;
}

function print() {
  window.print();
}
</script>

<template>
  <div class="transaction_records_page q-py-sm">
    <div class="row q-col-gutter-md items-center" style="max-width: 860px">
      <InputBox label="" class="col-xs-12 col-sm-5">
        <OInput name="name" rounded dense hide-bottom-space placeholder="請輸入客戶名稱或電話" clearable />
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
        @update:model-value="getRecordList({ page: $event })"
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
      <QCard class="q-py-md q-px-xl relative-position">
        <QIcon v-close-popup name="close" color="black" class="cursor-pointer absolute-right no-print" size="24px" style="top: 10px; right: 10px;" />
        <QCardSection class="q-pb-none ">
          <div class="text-h6 text-center q-mb-none text-bold">
            收據
          </div>
        </QCardSection>
        <QCardSection>
          <Receipt :data="receiptData" :space-name="space" :is-point-type="paymentMethod === PaymentTypes['點數']" />
        </QCardSection>
        <QCardSection class="actions no-print">
          <QBtn label="列印收據" style="width: 100%; font-size: 16px;" padding="12px 0" color="black" @click="print" />
        </QCardSection>
      </QCard>
    </QDialog>
  </div>
</template>
