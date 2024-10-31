<script setup lang="ts">
import type { Checkout } from '@/api';
import { PaymentMethod } from '@/const/appointment';
import { useFieldArray, useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

type Payment = Checkout['multiChannelPay'][number];
interface Option {
  label: string;
  value: any;
}
interface GroupOption extends Option {
  points: number;
}

const props = withDefaults(defineProps<{
  modelValue: Payment[];
  methodOptions: Option[];
  groupOptions?: GroupOption[];
  readonly?: boolean;
}>(), {
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: Payment[]];
}>();

const initVal = computed(() => {
  return ({
    payments: props.modelValue?.length >= 0
      ? props.modelValue
      : [{
          payMethod: props.methodOptions[0].value,
          amount: null,
          authorisationCode: null,
          receiptNumber: null,
          clientGroupId: null,
          pointUsed: null,
          groupClassTicketUsed: null,
          details: '',
        }],
  });
});
const { values } = useForm<{ payments: Payment[] }>({
  initialValues: initVal.value,
});
const { fields, push, remove, update } = useFieldArray<Payment>('payments');

watch(values, () => {
  emit('update:modelValue', values.payments.map((payment) => {
    const { amount, authorisationCode, receiptNumber, clientGroupId, pointUsed, groupClassTicketUsed, ...needed } = payment;
    return {
      ...needed,
      amount: amount ?? null,
      authorisationCode: authorisationCode ?? null,
      receiptNumber: receiptNumber ?? null,
      clientGroupId: clientGroupId ?? null,
      pointUsed: pointUsed ?? null,
      groupClassTicketUsed: groupClassTicketUsed ?? null,
    };
  }));
}, {
  immediate: true,
});

const selectedMethods = computed(() => values.payments.map(payment => payment.payMethod));
const selectedGroup = ref();

function updateSelectedGroup(group: GroupOption, field: any) {
  selectedGroup.value = group;
  update(+field.key, { ...field.value, clientGroupId: selectedGroup.value.value, amount: null });
}

function addPayment() {
  push({
    payMethod: props.methodOptions.filter(option => !selectedMethods.value.includes(option.value))[0].value,
    amount: null,
    authorisationCode: null,
    receiptNumber: null,
    clientGroupId: null,
    pointUsed: null,
    groupClassTicketUsed: null,
    details: '',
  });
}

function disableOption(opt: { label: string; value: any }) {
  return selectedMethods.value.includes(opt.value);
}

function getAmountLabel(method: number) {
  return [PaymentMethod['主管折扣'], PaymentMethod['折價券'], PaymentMethod['抵用券'], PaymentMethod['訂金'], PaymentMethod.唯心點數].includes(method)
    ? '折抵'
    : '金額';
}

function showExtra(method: number) {
  return method === PaymentMethod['堂數'] || method === PaymentMethod['信用卡'];
}

// function calcReceiptAmount(payments: Payment[]) {
//   const total = payments.reduce((acc, { payMethod, amount }) => {
//     const paymentDetail = Object.values(PaymentMethods).find(item => item.identifier === payMethod)!;
//     if (!paymentDetail.calcInReceipt || amount === null) {
//       return acc;
//     }
//     return acc += amount;
//   }, 0);
//   return total;
// }
</script>

<template>
  <div class="multi-payment">
    <div class="multi-payment__body">
      <div v-for="(field, idx) in fields" :key="field.key" class="payment">
        <div class="payment__body">
          <div class="input--method">
            <div class="input__label">支付方式</div>
            <OSelect :readonly="readonly" :name="`payments[${idx}].payMethod`" :options="methodOptions" :option-disable="disableOption" bg-color="white" />
          </div>
          <div class="input">
            <template v-if="field.value.payMethod === PaymentMethod['團課卷']">
              <div class="input__label">張數</div>
              <OInput :readonly="readonly" :name="`payments[${idx}].groupClassTicketUsed`" type="number" style="background-color: white;" />
            </template>
            <template v-else-if="field.value.payMethod === PaymentMethod['堂數']">
              <div class="input__label">堂數</div>
              <OInput :readonly="readonly" :name="`payments[${idx}].pointUsed`" type="number" style="background-color: white;" />
            </template>
            <template v-else>
              <div class="input__label">{{ getAmountLabel(field.value.payMethod) }}</div>
              <OInput :readonly="readonly" :name="`payments[${idx}].amount`" type="number" style="background-color: white;" />
            </template>
          </div>
          <div class="input--details">
            <div class="input__label">明細</div>
            <OInput :readonly="readonly" :name="`payments[${idx}].details`" style="background-color: white;" />
          </div>
          <QBtn v-if="!readonly" icon="o_delete" flat round style="translate: 0 10px;" @click="() => remove(idx)" />
        </div>
        <div v-if="showExtra(field.value.payMethod)" class="payment__extra">
          <div v-if="field.value.payMethod === PaymentMethod['堂數']" class="group">
            <template v-if="!readonly">
              <QSelect :readonly="readonly" :model-value="selectedGroup" :options="groupOptions" label="群組" dense outlined map-options style="width: 150px;" bg-color="white" @update:model-value="(groupOption: GroupOption) => updateSelectedGroup(groupOption, field)" />
              <p class="group__label">剩餘堂數：<span>{{ selectedGroup?.points }}</span></p>
            </template>
            <template v-else>
              <OInput readonly :name="`payments[${idx}].clientGroupName`" inside-label="群組" dense outlined style="background-color: white;" />
            </template>
          </div>
          <div v-else-if="field.value.payMethod === PaymentMethod['信用卡']" class="credit-card">
            <OInput :readonly="readonly" :name="`payments[${idx}].authorisationCode`" inside-label="授權碼" dense outlined style="width: 150px; background-color: white;" />
            <OInput :readonly="readonly" :name="`payments[${idx}].receiptNumber`" inside-label="簽單號" dense outlined style="background-color: white;" />
          </div>
        </div>
      </div>
      <div v-if="!readonly" class="multi-payment__actions">
        <QBtn label="增加付款方式" icon="add" flat dense :disable="selectedMethods.length === methodOptions.length" @click="addPayment" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-payment {
  padding: 20px;
  border: 1px dashed #999;
  border-radius: 10px;
  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.input {
  &--method {
    @extend .input;
    width: 150px;
  }
  &--details {
    @extend .input;
    flex-grow: 1;
  }
  &__label {
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 600;
  }
}

.payment {
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  // border: 1px dashed #999;
  &__body {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 10px;
  }
}

.group {
  display: flex;
  align-items: baseline;
  gap: 20px;
  &__label {
    font-size: 14px;
    > span {
      font-weight: 600;
    }
  }
}

.credit-card {
  display: flex;
  gap: 20px;
  align-items: center;
}

:deep(.q-field--with-bottom) {
  padding-bottom: 0;
}
:deep(.q-field__bottom) {
  display: none;
}
</style>
