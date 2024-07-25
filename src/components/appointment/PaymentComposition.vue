<script setup lang="ts">
import type { Checkout } from '@/api';
import { PaymentMethod } from '@/const/appointment';
import { useFieldArray, useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

type Payment = Checkout['payments'][number];
type Option = Record<string, any> & { label: string;value: any };

const props = defineProps<{
  modelValue: Payment[];
  methodOptions: Option[];
  groupOptions: Option[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Payment[]];
}>();

const { values } = useForm<{ payments: Payment[] }>({
  initialValues: {
    payments: [{
      payMethod: props.methodOptions[0].value,
      authorisationCode: '',
      receiptNumber: '',
      payAmount: null,
      clientGroupId: null,
      pointUsed: null,
      groupClassTicketUsed: null,
      details: '',
    }],
  },
});
const { fields, push, remove, update } = useFieldArray<Payment>('payments');

watch(values, () => {
  emit('update:modelValue', values.payments);
}, {
  immediate: true,
});

const selectedMethods = computed(() => values.payments.map(payment => payment.payMethod));
const selectedGroup = ref();

function updateSelectedGroup(group: (typeof props.groupOptions)[number], field: any) {
  selectedGroup.value = group;
  update(+field.key, { ...field.value, clientGroupId: selectedGroup.value.value });
}

function addPayment() {
  push({
    payMethod: props.methodOptions.filter(option => !selectedMethods.value.includes(option.value))[0].value,
    payAmount: null,
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
  return [PaymentMethod['主管折扣'], PaymentMethod['折價券'], PaymentMethod['抵用券'], PaymentMethod['訂金']].includes(method)
    ? '折抵'
    : '金額';
}

function showExtra(method: number) {
  return method === PaymentMethod['堂數'] || method === PaymentMethod['信用卡'];
}
</script>

<template>
  <div class="multi-payment">
    <div class="multi-payment__body">
      <div v-for="(field, idx) in fields" :key="field.key" class="payment">
        <div class="payment__body">
          <div class="input--method">
            <div class="input__label">支付方式</div>
            <OSelect :name="`payments[${idx}].payMethod`" :options="methodOptions" :option-disable="disableOption" bg-color="white" />
          </div>
          <div class="input">
            <template v-if="field.value.payMethod === PaymentMethod['團課卷']">
              <div class="input__label">張數</div>
              <OInput :name="`payments[${idx}].groupClassTicketUsed`" type="number" style="background-color: white;" />
            </template>
            <template v-else-if="field.value.payMethod === PaymentMethod['堂數']">
              <div class="input__label">堂數</div>
              <OInput :name="`payments[${idx}].pointUsed`" type="number" style="background-color: white;" />
            </template>
            <template v-else>
              <div class="input__label">{{ getAmountLabel(field.value.payMethod) }}</div>
              <OInput :name="`payments[${idx}].payAmount`" type="number" style="background-color: white;" />
            </template>
          </div>
          <div class="input--details">
            <div class="input__label">明細</div>
            <OInput :name="`payments[${idx}].details`" style="background-color: white;" />
          </div>
          <QBtn icon="o_delete" flat round style="translate: 0 10px;" @click="() => remove(idx)" />
        </div>
        <div v-if="showExtra(field.value.payMethod)" class="payment__extra">
          <div v-if="field.value.payMethod === PaymentMethod['堂數']" class="group">
            <QSelect :model-value="selectedGroup" :options="groupOptions" label="群組" dense outlined map-options style="width: 150px;" bg-color="white" @update:model-value="groupOption => updateSelectedGroup(groupOption, field)" />
            <p class="group__label">剩餘堂數：<span>{{ selectedGroup?.points }}</span></p>
          </div>
          <div v-else-if="field.value.payMethod === PaymentMethod['信用卡']" class="credit-card">
            <OInput :name="`payments[${idx}].authorisationCode`" inside-label="授權碼" dense outlined style="width: 150px; background-color: white;" />
            <OInput :name="`payments[${idx}].receiptNumber`" inside-label="簽單號" dense outlined style="background-color: white;" />
          </div>
        </div>
      </div>
      <div class="multi-payment__actions">
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
  &__extra {
    // padding: 10px 0;
    // margin-top: -24px;
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
