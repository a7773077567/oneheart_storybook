<script setup lang='ts'>
import { QSeparator, useQuasar } from 'quasar';
import { computed, ref, watch } from 'vue';
import { type CoachBonus, getCoachQuarterlyBonus, updateCoachQuarterlyBonus } from '@/api';
import { useUserStore } from '@/stores';
import { Field, useForm } from 'vee-validate';
import { array, number, object } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { YearMonthSelect } from '@/components/shared';
import dayjs from 'dayjs';

const userStore = useUserStore();
const $q = useQuasar();

const targetSpaceId = ref<null | number>(userStore.userInfo?.spaces?.[0]?.id ?? null);
const spaceOptions = computed(() => (userStore.userInfo?.spaces ?? []).map(space => ({ ...space, label: space.name, value: space.id })));

// year month
const yearMonth = ref({
  year: dayjs().year(),
  month: dayjs().month() + 1,
});

const yearMonthQuery = computed(() => `${yearMonth.value.year}/${String(yearMonth.value.month).padStart(2, '0')}`);

const schema = object({
  coachQuarterlyBonuses: array(object({
    coachUserId: number(),
    personalQuarterlyBonus: number(),
    groupQuarterlyBonus: number(),
    rankQuarterlyBonus: number(),
  })),
});

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(schema),
});

const submit = handleSubmit(async (values) => {
  try {
    await updateCoachQuarterlyBonus({
      spaceId: targetSpaceId.value!,
      yearMonth: yearMonthQuery.value,
      coachQuarterlyBonuses: values.coachQuarterlyBonuses,
    });
    $q.notify({ message: '教練季獎金儲存成功', timeout: 500, position: 'top' });
  }
  catch (error) {
    $q.notify({ message: '教練季獎金儲存失敗', timeout: 500, position: 'top', type: 'negative' });
  }
});

const list = ref<CoachBonus[]>([]);
getCoachBonusList();
async function getCoachBonusList() {
  if (!targetSpaceId.value)
    return console.warn('no space id');

  list.value = await getCoachQuarterlyBonus({ spaceId: targetSpaceId.value, yearMonth: yearMonthQuery.value });
  resetForm({ values: { coachQuarterlyBonuses: list.value } });
}

watch(() => [targetSpaceId.value, yearMonthQuery.value], () => {
  getCoachBonusList();
});
</script>

<template>
  <div class="coach-quarter-bonus">
    <h3 class="text-headline-medium q-mb-md">教練季獎金</h3>
    <p class="text-body-medium q-mb-lg">季獎金發放時間為「1、4、7、10」月，可於 <a class="text-primary text-weight-bold link" @click="$router.push({ name: 'salary-report' })">薪資詳情</a> 查看。</p>
    <QSeparator />
    <section class="coach-list">
      <div class="q-my-md coach-list__filters">
        <OptionSelect v-model="targetSpaceId" :options="spaceOptions" style="width: 228px" />
        <YearMonthSelect v-model="yearMonth" style="width: 240px" />
      </div>
      <ul class="q-py-md">
        <template v-for="(coach, idx) in list" :key="coach.coachUserId">
          <li class="row q-my-lg q-col-gutter-x-sm coach-item">
            <div class="col-auto coach-item__name">{{ coach.user.name }}</div>
            <div class="col">
              <Field v-slot="{ field }" :name="`coachQuarterlyBonuses[${idx}].personalQuarterlyBonus`">
                <BasicInput
                  hide-bottom-space label="個人季獎金*" type="number" :model-value="field.value"
                  @update:model-value="field.onChange(+$event)"
                />
              </Field>
            </div>
            <div class="col">
              <Field v-slot="{ field }" :name="`coachQuarterlyBonuses[${idx}].groupQuarterlyBonus`">
                <BasicInput
                  hide-bottom-space label="團體季獎金*" type="number" :model-value="field.value"
                  @update:model-value="field.onChange(+$event)"
                />
              </Field>
            </div>
            <div class="col">
              <Field v-slot="{ field }" :name="`coachQuarterlyBonuses[${idx}].rankQuarterlyBonus`">
                <BasicInput
                  hide-bottom-space label="職等季獎金*" type="number" :model-value="field.value"
                  @update:model-value="field.onChange(+$event)"
                />
              </Field>
            </div>
          </li>
          <QSeparator class="coach-item__separator" />
        </template>
      </ul>
    </section>
    <div class="flex justify-end">
      <QBtn color="primary" rounded label="儲存" class="q-px-lg" :disabled="!meta.valid" @click="submit" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.coach-quarter-bonus {
  display: flex;
  flex-direction: column;
  height: 100%;

  .coach-list {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;

    &__filters {
      flex: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ul {
      flex: 1;
      overflow: auto;
    }
  }

  .coach-item {
    align-items: center;

    &__name {
      width: 124px;
      overflow: hidden;
    }

    &__separator:last-child {
      display: none;
    }
  }

  .link {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
