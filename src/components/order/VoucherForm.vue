<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ClientSearch, OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { Client } from '@/api';
import { useClientStore, useVoucherStore } from '@/stores';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'goNext'): void;
}>();

const voucherStore = useVoucherStore();
const clientStore = useClientStore();
voucherStore.getGroupClass();

const pointsTopupSchema = z.object({
  clientName: z.string(),
  clientId: z.number(),
  clientPhone: z.string(),
  ticketGained: z.preprocess(a => Number(a), z.number().nonnegative()),
  amount: z.preprocess(a => Number(a), z.number().nonnegative()),
  groupClassId: z.preprocess(a => Number(a), z.number().nonnegative()),
});

const initialValues = computed(() => voucherStore.voucherDetail);
const { handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(pointsTopupSchema),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (values) => {
  const groupClassName = voucherStore.groupClassList.find(item => values.groupClassId === item.id)?.name;
  voucherStore.voucherDetail = {
    ...values,
    groupClassName,
  };

  emit('goNext');
});

const showClientSearch = ref(false);

function selectClient(selectList: Client[]) {
  const client = selectList[0];
  clientStore.targetClient = client;

  setFieldValue('clientId', client.id);
  setFieldValue('clientName', client.name);
  setFieldValue('clientPhone', client.phone);

  showClientSearch.value = false;
}
</script>

<template>
  <div class="voucher">
    <section class="q-py-md">
      <QBtn outline label="選擇會員" @click="showClientSearch = true" />
    </section>
    <QDialog v-model="showClientSearch">
      <ClientSearch @select="selectClient" @cancel="showClientSearch = false" />
    </QDialog>

    <form class="row q-col-gutter-md voucher_form" @submit.prevent>
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
        <span class="field--key">團課課程</span>
        <OSelect
          class="field--val" name="groupClassId" :options="voucherStore.groupClassOptions" hide-bottom-space :virtual-scroll-item-size="50"
          error-message=""
        />
      </fieldset>
      <div class="col-12 row q-col-gutter-md items-center">
        <fieldset class="col-6 col-md-3">
          <span class="field--key">堂數</span>
          <OInput
            type="number" class="field--val" name="ticketGained" hide-bottom-space placeholder="數量"
            error-message=""
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
.voucher {
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
