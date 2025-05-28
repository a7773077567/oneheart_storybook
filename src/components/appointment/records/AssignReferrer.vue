<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { number, object } from 'zod';
import { RoleType, type User, fetchSpaces, fetchUsers, updateReferalUser } from '@/api';
import { useNotify } from '@/composables/notify';
import { removeZhuyin } from '@/utils/helpers';
import type { QSelectSlots } from 'quasar';

const props = defineProps<{
  title: string;
  initVal: number | null ;
  clientScheduleId: number;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save'): void;
}>();

const isFetchingReferral = ref(false);
const referralList = ref<User[]>([]);
const keyword = ref('');
const filterReferralList = computed(() => keyword.value ? referralList.value.filter(user => user.name.includes(keyword.value)) : referralList.value);

getReferralList();
async function getReferralList() {
  isFetchingReferral.value = true;
  const spaces = await fetchSpaces();
  const res = await fetchUsers({ spaceIds: spaces.map(s => s.id), roleTypes: [RoleType['院長'], RoleType['副院長'], RoleType['物理治療師組長'], RoleType['物理治療師']] });
  referralList.value = res.map(user => ({ label: user.name, value: user.id, space: user.spaces.map(s => s.name).join(','), ...user }));
  isFetchingReferral.value = false;
}

const initialValues = computed(() => ({ referalUserId: props.initVal }));

const schema = computed(() => {
  return object({
    referalUserId: number().nullable(),
  });
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (v) => {
  if (!v.referalUserId)
    return;
  await updateReferalUser({ clientScheduleId: props.clientScheduleId, referalUserId: v.referalUserId ?? null });
  useNotify('編輯轉介治療師成功');
  emit('save');
});

function filterReferral(val: string) {
  keyword.value = removeZhuyin(val);
}

type Scope = Parameters<QSelectSlots['option']>[0];
</script>

<template>
  <QCard class="form">
    <QCardSection>
      <h2 class="form--title">{{ title }}</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <form @submit.prevent>
        <OSelect
          use-input name="referalUserId" label="選擇轉介治療師(選填)"
          :options="filterReferralList"
          hide-bottom-space class="q-mt-md"
          emit-value
          map-options
          :disable="isFetchingReferral"
          popup-content-class="referral_menu"
          clearable
          @input-value="filterReferral"
          @clear="keyword = ''"
        >
          <template #option="scope">
            <QItem v-bind="(scope as Scope).itemProps" style="max-width: 100%">
              <QItemSection>
                <QItemLabel>{{ (scope as Scope).opt.label }}</QItemLabel>
              </QItemSection>
              <QItemSection>
                <QItemLabel caption>{{ (scope as Scope).opt.space }}</QItemLabel>
              </QItemSection>
            </QItem>
          </template>
        </OSelect>
      </form>
    </QCardSection>
    <QCardActions class="q-pa-lg justify-end">
      <QBtn label="取消" @click="$emit('cancel')" />
      <QBtn label="確定" color="black" @click="onSubmit" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.form {
  width: 336px;
  &--title {
    font-size: 24px;
  }

  &--subtitle {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
  }

  .input-box {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :slotted(.q-field) {
    flex: 1 1 auto;
  }
}
</style>

<style>
.referral_menu {
  max-width: 300px !important;
}
</style>
