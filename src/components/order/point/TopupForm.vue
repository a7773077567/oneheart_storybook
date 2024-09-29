<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ClientSearch, OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { Client } from '@/api';
import { usePointsStore } from '@/stores';
import { pointsPlan } from '@/const/points';
import { PointTypes } from '@/const/general';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
}>();

const pointsStore = usePointsStore();
const pointsTopupSchema = z.object({
  clientName: z.string(),
  clientId: z.number(),
  clientPhone: z.string(),
  groupName: z.string(),
  clientGroupId: z.number(),
  plan: z.number().min(1).nullable(),
  pointType: z.nativeEnum(PointTypes),
  paidPointGained: z.preprocess(a => Number(a), z.number().nonnegative()),
  giftPointGained: z.preprocess(a => Number(a), z.number().nonnegative().optional().default(0)),
  amount: z.preprocess(a => Number(a), z.number().nonnegative()),
});

const initialValues = computed(() => pointsStore.topupDetail);
const { handleSubmit, values, resetField, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(pointsTopupSchema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (values) => {
  pointsStore.topupDetail = { ...values, planName: pointsPlan.find(plan => plan.id === values.plan)!.name ?? '', contractDottedsignTaskId: null };

  emit('goNext');
});

const showClientSearch = ref(false);
const totalPoints = computed(() => (Number(values.paidPointGained ?? 0)) + (Number(values.giftPointGained ?? 0)));

const planOptions = computed(() => {
  return pointsPlan.filter(({ type }) => type === values?.pointType || type === 'all').map(({ name, id }) => ({ label: name, value: id }));
});

function selectClient(selectList: Client[]) {
  const client = selectList[0];

  pointsStore.targetClient = client;

  setFieldValue('clientId', client.id);
  setFieldValue('clientName', client.name);
  setFieldValue('clientPhone', client.phone);

  resetField('clientGroupId');

  showClientSearch.value = false;
  pointsStore.getPointGroupOptions(client.id);
}

function getPointGroup(group: { name: string; id: number; type: PointTypes }) {
  setFieldValue('clientGroupId', group.id ?? '');
  setFieldValue('groupName', group.name ?? '');
  setFieldValue('pointType', group.type);
}

function setDefaultVal(selectedId: number) {
  const selectedPlan = pointsPlan.find(plan => plan.id === selectedId)!;

  setFieldValue('paidPointGained', selectedPlan?.paidPointGained);
  setFieldValue('giftPointGained', selectedPlan?.giftPointGained);
  setFieldValue('amount', selectedPlan?.price);
}
</script>

<template>
  <div class="points_topup">
    <section class="q-py-md">
      <QBtn outline label="選擇儲值會員" @click="showClientSearch = true" />
    </section>
    <QDialog v-model="showClientSearch">
      <ClientSearch @select="selectClient" @cancel="showClientSearch = false" />
    </QDialog>

    <form class="row q-col-gutter-md points_topup_form" @submit.prevent>
      <fieldset class="col-11 col-md-8">
        <span class="field--key">客戶</span>
        <OInput readonly class="field--val" name="clientName" hide-bottom-space :virtual-scroll-item-size="50" />
        <div class="q-ml-md">
          <QBadge color="black" class="q-px-sm text-body1">
            會員編號：
            <template v-if="!!values.clientId">
              #{{ values.clientId }}
            </template>
          </QBadge>
        </div>
      </fieldset>
      <fieldset class="col-8">
        <span class="field--key">堂數群組</span>
        <OSelect
          class="field--val" name="groupName" :options="pointsStore.pointGroupOptions" hide-bottom-space
          :virtual-scroll-item-size="50" :disable="!values.clientId" error-message=""
          @update:model-value="getPointGroup"
        />
        <div class="q-ml-md text-caption" style="min-width:98px">
          堂數類別：<span v-if="!!values.pointType" class="text-caption">
            {{ PointTypes[values.pointType] }}
          </span>
        </div>
      </fieldset>
      <fieldset class="col-8">
        <span class="field--key">方案</span>
        <OSelect
          class="field--val" name="plan" :options="planOptions" hide-bottom-space :virtual-scroll-item-size="50"
          error-message="" @update:model-value="setDefaultVal"
        />
      </fieldset>
      <div class="col-12 row q-col-gutter-md items-center">
        <fieldset class="col-6 col-md-3">
          <span class="field--key">堂數</span>
          <OInput
            type="number" class="field--val" name="paidPointGained" hide-bottom-space placeholder="數量"
            error-message=""
          />
        </fieldset>
        <fieldset class="col-6 col-md-3">
          <span class="field--key">贈堂</span>
          <OInput type="number" class="field--val" name="giftPointGained" hide-bottom-space placeholder="數量" />
        </fieldset>
        <fieldset class="col-12 col-md-2">
          <span class="field--key">總數：</span>
          <QInput
            type="number" :model-value="totalPoints" class="field--val" hide-bottom-space placeholder="數量" disable
            readonly
          />
        </fieldset>
      </div>
      <fieldset class="col-8">
        <span class="field--key">金額</span>
        <OInput type="number" class="field--val" name="amount" hide-bottom-space placeholder="$" error-message="" />
      </fieldset>
    </form>
    <div class="q-my-lg flex">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="() => resetForm()" />
      <QBtn size="md" label="下一步" color="black" class="q-px-lg" @click="onSubmit" />
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
      margin-right: 8px;
      text-align: right;
    }

    .field--val {
      flex: 1;
    }
  }
}
</style>
