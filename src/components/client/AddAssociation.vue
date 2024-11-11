<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type Client, addClientAssociation } from '@/api';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { OMemberSearch } from '@/components/shared';

const props = defineProps<{
  clientId: number;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();

const newAssociationSchema = z.object({
  name: z.string().min(1),
  relationTypeName: z.string().optional(),
  identityType: z.number().optional(),
  identityNumber: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
});

const { handleSubmit, errors, setFieldValue, values, resetForm } = useForm({
  validationSchema: toTypedSchema(newAssociationSchema),
});
const hasNameOrPhone = computed(() => !!values.name || !!values.phone);
const isExistedClient = ref(false);

function selectClient(client: Client | null) {
  if (!client)
    return;

  isExistedClient.value = true;
  const fields = Object.keys(newAssociationSchema.shape);
  type FieldName = keyof typeof newAssociationSchema.shape;
  fields.forEach((field) => {
    const val = client[field as keyof typeof client] as string | null;
    if (field && val) {
      setFieldValue(field as FieldName, val);
    }
  });
}

function createNewAccount(info: { name: string | null; phone: string | null }) {
  if (!info.name && !info.phone)
    return;

  const fieldName = info.name ? 'name' : 'phone';
  const fieldValue = info.name || info.phone;
  setFieldValue(fieldName, fieldValue as string);
}

function clearClient() {
  resetForm({ values: { phone: '' } });
  isExistedClient.value = false;
}

const $q = useQuasar();
const isProceeding = ref(false);
const onSubmit = handleSubmit(async (formData) => {
  isProceeding.value = true;
  try {
    await addClientAssociation(props.clientId, formData);
    $q.notify({ message: '常用人員新增成功', timeout: 200, position: 'top' });
    emit('submit');
  }
  finally {
    isProceeding.value = false;
  }
});
</script>

<template>
  <QCard class="add_association_form">
    <QCardSection class="text-center add_association_form__header">
      新增常用人員
    </QCardSection>
    <QCardSection class="q-px-lg">
      <form class="add_association_form__content row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-12">
          <OMemberSearch
            add-value
            label="客戶姓名或電話*"
            name="clientId"
            placeholder="搜尋電話或姓名"
            class="full-width"
            error-message=""
            @update:full-info="selectClient"
            @add-value="createNewAccount"
            @clear="clearClient"
          >
            <template #selected-item>
              <span v-if="values.name">{{ values.name }}</span>
            </template>
          </OMemberSearch>
        </fieldset>
        <template v-if="hasNameOrPhone">
          <fieldset class="col-12">
            <OInput :disable="isExistedClient" inside-label="電話*" name="phone" hide-bottom-space :error="!!errors.phone" error-message="" class="col-grow" />
          </fieldset>
          <fieldset class="col-12">
            <OInput inside-label="暱稱(非必填)" name="relationTypeName" hide-bottom-space :error="!!errors.relationTypeName" class="col-grow" />
          </fieldset>
          <fieldset class="col-12">
            <OInput :disable="isExistedClient" inside-label="生日(非必填)" date-mode name="birthDate" hide-bottom-space :error="!!errors.birthDate" class="col-grow" />
          </fieldset>
          <fieldset class="col-12">
            <OInput :disable="isExistedClient" inside-label="身分證/居留證(非必填)" name="identityNumber" hide-bottom-space class="col-grow" />
          </fieldset>
        </template>
      </form>
    </QCardSection>
    <QCardActions vertical class="q-pa-lg add_association_form__actions">
      <QBtn label="確定" color="black" @click="onSubmit" />
      <QBtn label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.add_association_form {
  max-width: 800px !important;
  fieldset {
    min-width: 432px;
  }
  &__header {
    font-weight: 600;
  }
  &__content {
    fieldset {
      display: flex;
      align-items: center;
      gap: 8px;
      > .label {
        width: 60px;
        text-align: right;
        flex-shrink: 0;
      }
      > .q-field {
        flex: 1;
      }
    }
  }
  &__actions {
    gap: 8px;
  }
}
</style>
