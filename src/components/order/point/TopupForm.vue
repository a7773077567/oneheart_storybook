<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ClientSearch, OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { createPointGroup } from '@/api';
import { type Client, type CreateGroupField, getDepInChargeTherapist } from '@/api';
import { usePointsStore } from '@/stores';
import { POINTS_PLAN, plansByType, pointUnit } from '@/const/points';
import { PointTypes } from '@/const/general';
import PointsGroupForm from '@/components/client/pointsGroup/PointsGroupForm.vue';
import { useQuasar } from 'quasar';

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
  plan: z.number(),
  pointType: z.nativeEnum(PointTypes),
  paidPointGained: z.preprocess(a => Number(a), z.number().nonnegative()),
  giftPointGained: z.preprocess(a => Number(a), z.number().nonnegative().optional().default(0)),
  amount: z.preprocess(a => Number(a), z.number().nonnegative()),
  sellers: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })).default([]),
  chargers: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })).default([]),
});

const initialValues = computed(() => pointsStore.topupDetail);

const { handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(pointsTopupSchema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (values) => {
  pointsStore.topupDetail = {
    ...values,
    planName: values.plan ? POINTS_PLAN[values.plan].name : '',
    contractDottedsignTaskId: null,
  };

  emit('goNext');
});

// data
const showClientSearch = ref(false);
const totalPoints = computed(() => (Number(values.paidPointGained ?? 0)) + (Number(values.giftPointGained ?? 0)));

const planOptions = computed(() => {
  const targetType = plansByType.find(({ type }) => type === values.pointType);

  if (!targetType) {
    return Object.keys(POINTS_PLAN).map(planId => ({ label: POINTS_PLAN[+planId].name, value: +planId }));
  };

  return targetType?.plans.map(planId => ({ label: POINTS_PLAN[planId].name, value: planId }));
});

function selectClient(selectList: Client[]) {
  const client = selectList[0];

  pointsStore.targetClient = client;
  if (values.clientGroupId) {
    resetForm({ values: { ...initialValues.value, clientId: client.id, clientName: client.name, clientPhone: client.phone } });
  }
  else {
    setFieldValue('clientId', client.id);
    setFieldValue('clientName', client.name);
    setFieldValue('clientPhone', client.phone);
  }

  showClientSearch.value = false;
  pointsStore.getPointGroupOptions(client.id);
}

const remainingPoints = ref(0);
async function getPointGroup(group: { name: string; id: number; type: PointTypes; points: number }) {
  remainingPoints.value = group.points;
  setFieldValue('clientGroupId', group.id ?? '');
  setFieldValue('groupName', group.name ?? '');
  setFieldValue('pointType', group.type);
  setFieldValue('plan', undefined);
  // refactor: 堂數、金額重置？

  if (values.clientId) {
    setDefaultChargers(values.clientId, group.type);
  }
}

async function setDefaultChargers(clientId: number, type: PointTypes) {
  // 負責人會自動代群組的所有人員的對應科別負責人
  const chargers = await getDepInChargeTherapist(clientId, { clientGroupType: type });
  setFieldValue('chargers', chargers.filter(charger => !!charger.inChargeUserId).map(charger => ({ value: charger.inChargeUserId, label: charger.inChargeUserName })));
}

function setDefaultVal(selectedId: number) {
  const selectedPlan = POINTS_PLAN[selectedId];

  setFieldValue('paidPointGained', selectedPlan?.paidPointGained);
  setFieldValue('giftPointGained', selectedPlan?.giftPointGained);
  setFieldValue('amount', selectedPlan?.price);
}

// 新增群組
const showAddForm = ref(false);
const newGroupInitVals = computed(() => ({ ...(values.clientId ? { adminClient: { name: values.clientName ?? '', phone: values.clientPhone ?? '', id: values.clientId } } : {}) }));

const $q = useQuasar();
async function createGroup(value: CreateGroupField) {
  await createPointGroup(value);
  $q.dialog({
    message: '群組創建成功',
  });
  showAddForm.value = false;
  values.clientId && pointsStore.getPointGroupOptions(values.clientId);
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
        <OInput
          inside-label="客戶*" readonly class="field--val" name="clientName" hide-bottom-space
          :virtual-scroll-item-size="50"
        />
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
        <div class="full-width row items-start">
          <div class="col-8">
            <OSelect
              label="堂數群組*" :disable="!values.clientId" class="field--val" name="groupName"
              :options="pointsStore.pointGroupOptions" hide-bottom-space :virtual-scroll-item-size="50" error-message=""
              @update:model-value="getPointGroup"
            />
            <p class="q-mt-md q-ml-sm">
              剩餘{{ pointUnit[(values.pointType ?? PointTypes.物理治療)] ?? '堂' }}數： {{ remainingPoints }} {{
                pointUnit[(values.pointType
                  ?? PointTypes.物理治療)] ?? '堂' }}
            </p>
          </div>
          <QBtn class="col-auto q-ml-md" outline label="新增群組" :disable="!values.clientId" @click="showAddForm = true" />
        </div>
      </fieldset>
      <fieldset class="col-8">
        <OSelect
          label="方案*" class="field--val" name="plan" :options="planOptions" hide-bottom-space
          :virtual-scroll-item-size="50" error-message="" @update:model-value="setDefaultVal"
        />
      </fieldset>
      <div class="col-12 row q-col-gutter-md items-center">
        <fieldset class="col-6 col-md-3">
          <OInput
            :inside-label="`${pointUnit[values.pointType ?? PointTypes.物理治療] ?? '堂'}數*`" type="number" class="field--val"
            name="paidPointGained" hide-bottom-space placeholder="數量" error-message=""
          />
        </fieldset>
        <fieldset class="col-6 col-md-3">
          <OInput
            :inside-label="`贈送${pointUnit[values.pointType ?? PointTypes.物理治療] ?? '堂'}數*`" type="number"
            class="field--val" name="giftPointGained" hide-bottom-space placeholder="數量" error-message=""
          />
        </fieldset>
        <fieldset class="col-12 col-md-2">
          <QInput
            label="總數" type="number" :model-value="totalPoints" class="field--val" hide-bottom-space
            placeholder="數量" disable readonly
          />
        </fieldset>
      </div>
      <fieldset class="col-8">
        <OInput
          inside-label="金額*" type="number" class="field--val" name="amount" hide-bottom-space placeholder="$"
          error-message=""
        />
      </fieldset>
      <fieldset class="col-8">
        <OSelect
          multiple label="負責人(選填、可複選)" class="field--val" name="chargers" :options="pointsStore.sellerOptions"
          hide-bottom-space :virtual-scroll-item-size="50" :emit-value="false" error-message="" option-label="label"
          option-value="value"
        />
      </fieldset>
      <fieldset class="col-8">
        <OSelect
          multiple label="銷售者(選填、可複選)" class="field--val" name="sellers" :options="pointsStore.sellerOptions"
          hide-bottom-space :virtual-scroll-item-size="50" :emit-value="false" error-message="" option-label="label"
          option-value="value"
        />
      </fieldset>
    </form>
    <div class="q-my-lg flex">
      <QBtn outline size="md" label="取消" class="q-px-lg q-mr-md" @click="() => resetForm()" />
      <QBtn size="md" label="下一步" color="black" class="q-px-lg" @click="onSubmit" />
    </div>
  </div>
  <QDialog v-model="showAddForm">
    <PointsGroupForm type="add" :init-val="newGroupInitVals" @cancel="showAddForm = false" @create="createGroup" />
  </QDialog>
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
