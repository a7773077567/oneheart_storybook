<script setup lang='ts'>
import { computed, ref } from 'vue';
import { OInput } from '@/components/shared';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { type Client, type GroupClass, getClientVouchers } from '@/api';
import type { RefundDetail } from '@/views/order/voucher/RefundVoucher.vue';

const props = defineProps<{
  modelValue: Partial<RefundDetail>;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
  (e: 'update:modelValue', val: typeof props['modelValue']): void;
}>();

const pointRefundSchema = z.object({
  clientId: z.number(),
  client: z.object({
    name: z.string(),
    phone: z.string(),
    birthDate: z.string().nullable(),
    identityNumber: z.string().nullable(),
    gender: z.string().nullable(),
  }).nullable(),
  groupClassId: z.number(),
  groupClass: z.object({
    id: z.number(),
    name: z.string(),
    useAbleGroupClassTickets: z.number().nonnegative().gt(0, '退券數量須大於0'),
  }).nullable(),
  amount: z.number(),
});

const initialValues = computed(() => ({
  ...props.modelValue,
  client: null,
  groupClass: null,
  amount: 0,
  multiChannelPay: [],
}));

const { handleSubmit, resetForm, values, setFieldValue, meta, errors } = useForm({
  validationSchema: toTypedSchema(pointRefundSchema),
  initialValues: initialValues.value,
});
const classCounts = computed(() => values.groupClass?.useAbleGroupClassTickets);

const onSubmit = handleSubmit(async (values) => {
  emit('update:modelValue', values);
  emit('goNext');
});

const groupClassList = ref<object[]>([]);
async function getClientGroup() {
  if (values.clientId) {
    const data = await getClientVouchers(values.clientId);
    groupClassList.value = data.map(option => ({ label: option.name, value: option }));
  }
}

function setRefundClassAmount(groupClass: GroupClass) {
  setFieldValue('groupClassId', groupClass.id);
}

function selectClient({ name, phone, identityNumber, birthDate, gender }: Partial<Client>) {
  setFieldValue('client', { name, phone, identityNumber, birthDate, gender });
}
</script>

<template>
  <div class="points_topup">
    <form class="row q-col-gutter-md points_topup_form" @submit.prevent>
      <fieldset class="col-12">
        <span class="field--key">客戶</span>
        <OMemberSearch
          name="clientId" placeholder="搜尋電話或姓名" class="full-width" @update:model-value="getClientGroup"
          @full-info="selectClient"
        />
      </fieldset>

      <fieldset class="col-12">
        <span class="field--key">團課券</span>
        <OSelect
          label="請選擇團課券"
          class="field--val" name="groupClass" :options="groupClassList" hide-bottom-space
          :virtual-scroll-item-size="50" :disable="!values.clientId" :error-message="errors.groupClass"
          @update:model-value="setRefundClassAmount"
        />
      </fieldset>

      <fieldset class="col-12">
        <span class="field--key">退回券數</span>
        <div class="text-weight-medium"> {{ typeof classCounts === 'number' ? `${classCounts ?? 0} 堂` : '-' }} </div>
      </fieldset>

      <fieldset class="col-12">
        <span class="field--key">退款金額</span>
        <OInput type="number" class="field--val" name="amount" placeholder="$" :error-message="errors.amount" />
      </fieldset>
    </form>
    <div class="q-my-lg flex">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="() => resetForm()" />
      <QBtn size="md" label="下一步" color="black" class="q-px-lg" :disable="!meta.valid" @click="onSubmit" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.points_topup {
  &_form {
    padding: 16px 0;

    fieldset {
      display: flex;
      align-items: center;
    }

    .field--key {
      width: 65px;
      margin-right: 16px;
      text-align: right;
      flex-shrink: 0;
    }

    .field--val {
      flex: 1;
    }
  }
}
</style>
