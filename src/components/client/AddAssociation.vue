<script setup lang='ts'>
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IdentityNumberType } from '@/api/clientManagement';

defineProps<{
  clientId: string;
}>();

defineEmits<{
  (e: 'cancel'): void;
}>();

const newAssociationSchema = z.object({
  name: z.string().min(1),
  relationTypeName: z.string(),
  identityType: z.number(IdentityNumberType),
  identityNumber: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(newAssociationSchema),
});

const onSubmit = handleSubmit((formData) => {
  console.log(formData);
});
</script>

<template>
  <QCard>
    <QCardSection class="text-center add_association_dialog__header">
      新增常用人員
    </QCardSection>
    <QCardSection>
      <form class="add_association_dialog__content row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-6 col-md-4">
          <span class="label">姓名</span>
          <OInput hide-bottom-space />
        </fieldset>
        <fieldset class="col-6 col-md-4">
          <span class="label">電話</span>
          <OInput hide-bottom-space />
        </fieldset>
        <fieldset class="col-6 col-md-4">
          <span class="label">暱稱</span>
          <OInput hide-bottom-space />
        </fieldset>
        <fieldset class="col-6 col-md-12">
          <span class="label">生日</span>
          <OInput hide-bottom-space />
        </fieldset>
        <fieldset class="col-6 col-md-12">
          <span class="label">地址</span>
          <OInput hide-bottom-space />
        </fieldset>
      </form>
    </QCardSection>
    <QCardActions vertical class="q-pa-lg add_association_dialog__actions">
      <QBtn label="確定" color="black" @click="onSubmit" />
      <QBtn label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.add_association_dialog {
  &__header {
    font-weight: 600;
  }
  &__content {
    fieldset {
      display: flex;
      align-items: center;
      > .label {
        width: 50px;
        flex: 0 0 auto;
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
