<script setup lang='ts'>
import { computed, ref } from 'vue';
import { OInput } from '@/components/shared';
import { Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { usePointsStore } from '@/stores';
import { PointTypes } from '@/const/general';
import type { Client, PointsGroup, RefundPointPlan } from '@/api';
import type { RefundDetail } from '@/views/order/point/RefundPoint.vue';
import RefundPlanSelect from './RefundPlanSelect.vue';

const props = defineProps<{
  modelValue: Partial<RefundDetail>;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
  (e: 'update:modelValue', val: typeof props['modelValue']): void;
}>();

const pointsStore = usePointsStore();
const pointRefundSchema = z.object({
  clientId: z.number(),
  client: z.object({
    name: z.string(),
    phone: z.string(),
    birthDate: z.string().nullable().optional(),
    identityNumber: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
  }).nullable(),
  clientGroupId: z.number(),
  pointGroup: z.object({
    id: z.number(),
    type: z.nativeEnum(PointTypes),
    name: z.string(),
    points: z.number().nonnegative().gt(0, '退堂數量需大於0'),
  }).nullable(),
  amount: z.number(),
  pointPayment: z.object({
    id: z.number(),
    plan: z.string(),
    useAblePoints: z.number(),
    amount: z.number(),
    sellers: z.array(z.object({
      id: z.number(),
      name: z.string(),
    })).default([]),
    chargers: z.array(z.object({
      id: z.number(),
      name: z.string(),
    })).default([]),
  }),
});

const initialValues = computed(() => ({
  ...props.modelValue,
  client: null,
  pointGroup: null,
  amount: 0,
  multiChannelPay: [],
}));

const { handleSubmit, resetForm, values, setFieldValue, meta, errors } = useForm({
  validationSchema: toTypedSchema(pointRefundSchema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (values) => {
  emit('update:modelValue', { ...values, pointPaymentId: values.pointPayment.id } as Partial<RefundDetail>);
  emit('goNext');
});

function getClientGroup() {
  if (values.clientGroupId) {
    resetForm();
  }

  if (values.clientId) {
    pointsStore.getPointGroupOptions(values.clientId);
  }
}

function selectPointGroup(pointGroup: PointsGroup) {
  setFieldValue('clientGroupId', pointGroup.id);
  setFieldValue('pointPayment', undefined);
  pointsStore.getAvaiRefundablePlans(pointGroup.id);
}

function selectClient({ name, phone, identityNumber, birthDate, gender }: Partial<Client>) {
  setFieldValue('client', { name, phone, identityNumber, birthDate, gender });
}

function setAmount(option: RefundPointPlan) {
  setFieldValue('amount', option?.amount ?? 0);
}
</script>

<template>
  <div class="points_topup">
    <form class="row q-col-gutter-md points_topup_form" @submit.prevent>
      <fieldset class="col-12 col-sm-9 col-md-7">
        <OMemberSearch
          label="客戶"
          name="clientId"
          placeholder="搜尋電話或姓名"
          class="full-width"
          error-message=""
          @update:model-value="getClientGroup"
          @update:full-info="selectClient"
        />
      </fieldset>

      <fieldset class="col-12 col-sm-9 col-md-7">
        <OSelect
          label="堂數群組"
          class="field--val" name="pointGroup" :options="pointsStore.pointGroupOptions" hide-bottom-space
          :virtual-scroll-item-size="50" :disable="!values.clientId" :error-message="errors.pointGroup"
          @update:model-value="selectPointGroup"
        />
      </fieldset>

      <!-- <fieldset class="col-12 col-sm-9 col-md-7">
        <span class="field--key">退回堂數</span>
        <div class="text-weight-medium"> {{ typeof classCounts === 'number' ? `${classCounts ?? 0} 堂` : '-' }} </div>
      </fieldset> -->

      <fieldset class="col-12 col-sm-9 col-md-7">
        <Field v-slot="{ handleChange, field }" name="pointPayment" @update:model-value="setAmount">
          <RefundPlanSelect :model-value="field.value" :list="pointsStore.refundableList" :point-type="values.pointGroup?.type" @update:model-value="handleChange" />
        </Field>
      </fieldset>

      <fieldset class="col-12 col-sm-9 col-md-7">
        <OInput inside-label="退款金額" type="number" class="field--val" name="amount" hide-bottom-space placeholder="$" error-message="" prefix="$" />
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
