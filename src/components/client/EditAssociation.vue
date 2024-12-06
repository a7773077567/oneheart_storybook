<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type ClientAssociation, editAssociation } from '@/api';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { IdentityType } from '@/const/client';

const props = defineProps<{
  clientId: number;
  associationId: number;
  initVal: ClientAssociation;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();

const newAssociationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
  relationTypeName: z.string().nullable(),
  identityType: z.union([z.nativeEnum(IdentityType), z.null()]).optional(),
  identityNumber: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
});

const { values, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(newAssociationSchema),
  initialValues: props.initVal,
});

const $q = useQuasar();
const onSubmit = handleSubmit(async (formData) => {
  await editAssociation({ clientId: props.clientId, associationClientId: props.associationId, data: formData });
  $q.notify({ message: '常用人員編輯成功', timeout: 600, position: 'top' });
  emit('submit');
});
</script>

<template>
  <QCard class="edit_association_form">
    <QCardSection class="text-center edit_association_form__header">
      編輯常用人員
    </QCardSection>
    <QCardSection class="q-px-lg">
      <form class="edit_association_form__content row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-12">
          <OInput inside-label="客戶姓名*" name="name" hide-bottom-space :error="!!errors.name" error-message="" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <OInput inside-label="電話*" name="phone" hide-bottom-space :error="!!errors.phone" error-message="" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <OInput inside-label="暱稱(非必填)" name="relationTypeName" hide-bottom-space :error="!!errors.relationTypeName" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <OInput inside-label="生日(非必填)" date-mode name="birthDate" hide-bottom-space :error="!!errors.birthDate" class="col-grow" />
        </fieldset>
        <fieldset class="col-12">
          <div class="q-gutter-lg">
            <QRadio :model-value="values.identityType" :val="IdentityType.nationalID" label="身份字號" @update:model-value="setFieldValue('identityType', IdentityType.nationalID)" />
            <QRadio :model-value="values.identityType" :val="IdentityType.residentCertificate" label="居留證號" @update:model-value="setFieldValue('identityType', IdentityType.residentCertificate)" />
          </div>
        </fieldset>
        <fieldset class="col-12">
          <OInput inside-label="身分證/居留證(非必填)" name="identityNumber" hide-bottom-space class="col-grow" />
        </fieldset>
      </form>
    </QCardSection>
    <QCardActions vertical class="q-pa-lg add_association_form__actions">
      <QBtn label="確定" color="black" @click="onSubmit" />
      <QBtn label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.edit_association_form {
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
