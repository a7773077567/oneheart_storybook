<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ClientSearch, OInput, OSelect } from '@/components/shared';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { Client } from '@/api';

const pointsTopupSchema = z.object({
  plan: z.string().min(1),
  points: z.preprocess(a => Number(a), z.number().nonnegative()),
  freePoints: z.preprocess(a => Number(a), z.number().nonnegative().optional()),
  amount: z.preprocess(a => Number(a), z.number().nonnegative()),
});

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(pointsTopupSchema),
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

const showClientSearch = ref(false);
const targetClient = ref<Client>();
// const totalPoints = computed(() => values);
const totalPoints = computed(() => (Number(values.points ?? 0)) + (Number(values.freePoints ?? 0)));
</script>

<template>
  <div class="points_topup">
    <section class="q-py-md">
      <QCard bordered flat class="q-pa-sm">
        <!-- <QCardSection /> -->
        <QCardSection>
          <div class="row q-col-gutter-md items-center">
            <div class="col-3">
              <QBtn outline label="選擇會員" @click="showClientSearch = true" />
            </div>
            <div class="col-2">
              <QBadge color="black" class="q-px-sm text-body1">
                會員編號：
                #{{ targetClient?.id }}
              </QBadge>
            </div>
            <div class="col-7">
              {{ targetClient?.name }} /  {{ targetClient?.phone }}
            </div>
          </div>
        </QCardSection>
      </QCard>
    </section>
    <QDialog v-model="showClientSearch">
      <ClientSearch @select="(targetClient = $event), (showClientSearch = false)" @cancel="showClientSearch = false" />
    </QDialog>

    <form class="row q-col-gutter-md points_topup_form" @submit.prevent>
      <fieldset class="col-8">
        <span class="field--key">點數群組</span>
        <OSelect class="field--val" name="type" :options="[]" hide-bottom-space :virtual-scroll-item-size="50" :disable="!targetClient" />
      </fieldset>
      <fieldset class="col-8">
        <span class="field--key">方案</span>
        <!-- <OSelect name="type" :options="pointsGroupOptions" hide-bottom-space :virtual-scroll-item-size="50" /> -->
        <OInput class="field--val" name="activity" hide-bottom-space placeholder="請輸入群組名稱" />
      </fieldset>
      <div class="col-12 row q-col-gutter-md items-center">
        <fieldset class="col-4">
          <span class="field--key">點數</span>
          <OInput type="number" class="field--val" name="points" hide-bottom-space placeholder="數量" />
        </fieldset>
        <fieldset class="col-4">
          <span class="field--key">贈點</span>
          <OInput type="number" class="field--val" name="freePoints" hide-bottom-space placeholder="數量" />
        </fieldset>
        <div class="col-4">
          <span>總數：</span>
          <span>{{ totalPoints }}</span>
        </div>
      </div>
      <fieldset class="col-8">
        <span class="field--key">金額</span>
        <OInput type="number" class="field--val" name="amount" hide-bottom-space placeholder="$" error-message="" />
      </fieldset>
    </form>
    <div class="q-my-lg">
      <QBtn outline size="md" label="確定" class="q-px-lg" @click="onSubmit" />
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
