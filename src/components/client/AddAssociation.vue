<script setup lang='ts'>
import { ref } from 'vue';
import { addClientAssociation } from '@/api';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';

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

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(newAssociationSchema),
});

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
        <fieldset class="col-12 col-md-6">
          <span class="label">姓名*</span>
          <OInput name="name" hide-bottom-space :error="!!errors.name" error-message="" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">電話*</span>
          <OInput name="phone" hide-bottom-space :error="!!errors.phone" error-message="" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">暱稱</span>
          <OInput name="nickname" hide-bottom-space :error="!!errors.relationTypeName" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">生日</span>
          <OInput date-mode name="birthdate" hide-bottom-space :error="!!errors.birthDate" class="col-grow" />
        </fieldset>
        <fieldset class="col-12 col-md-6">
          <span class="label">身份證/ <br> 居留證</span>
          <OInput name="identityNumber" hide-bottom-space class="col-grow" />
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
.add_association_form {
  max-width: 800px !important;
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
