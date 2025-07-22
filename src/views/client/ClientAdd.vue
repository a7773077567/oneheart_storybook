<script setup lang="ts">
import { useForm } from 'vee-validate';
import { createClient } from '@/api';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { genderOptions } from '@/const/general';
import { OMemberSearch } from '@/components/shared';
import { howToKnowOptions } from '@/const/client';

const newClientSchema = z.object({
  name: z.string().min(1),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
  gender: z.string().optional(),
  identityNumber: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  introducerClientId: z.number().nullable().optional(),
  howToKnowUs: z.string(),
});

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(newClientSchema),
});

const $q = useQuasar();
const onSubmit = handleSubmit(async (values) => {
  // @ts-expect-error 須重新確認建立客戶所需要欄位
  await createClient(values);
  $q.dialog({
    message: '新增客戶成功！',
  }).onOk(() => {
    resetForm();
  });
});
</script>

<template>
  <section class="new_client q-mb-lg">
    <form class="row q-col-gutter-md" @submit.prevent>
      <fieldset class="col-12 col-md-6">
        <OInput name="name" inside-label="姓名*" hide-bottom-space class="col-grow" :error="!!errors.name" error-message="" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <OInput name="phone" inside-label="電話*" hide-bottom-space class="col-grow" :error="!!errors.phone" error-message="" />
      </fieldset>

      <fieldset class="col-12 col-md-6">
        <OInput date-mode class="col-grow" inside-label="生日" name="birthDate" hide-bottom-space :error="!!errors.birthDate" error-message="" />
      </fieldset>

      <fieldset class="col-12 col-md-6">
        <OInput name="identityNumber" inside-label="身分證字號/居留證" hide-bottom-space class="col-grow" :error="!!errors.identityNumber" error-message="" />
      </fieldset>

      <fieldset class="col-12 col-md-2">
        <OSelect name="gender" label="性別" hide-bottom-space :options="genderOptions" class="col-grow" style="background:white" :error="!!errors.gender" error-message="" />
      </fieldset>

      <fieldset class="col-12 col-md-10">
        <OInput name="address" inside-label="地址" hide-bottom-space class="col-grow" :error="!!errors.address" error-message="" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <OMemberSearch name="introducerClientId" label="介紹人" class="full-width" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <OSelect name="howToKnowUs" hide-bottom-space class="full-width" :options="howToKnowOptions" :error="!!errors.howToKnowUs" error-message="" label="從哪裡知道我們*" />
      </fieldset>
      <fieldset class="col-12">
        <OInput name="note" inside-label="備註" hide-bottom-space type="textarea" class="full-width" :error="!!errors.note" error-message="" />
      </fieldset>

      <div class="new_client_form--actions">
        <QBtn label="新增" unelevated rounded color="primary" class="q-px-lg" @click="onSubmit" />
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.new_client form {
  padding: 16px;
  fieldset {
    display: flex;
    align-items: center;
    gap: 8px;
    > span.label {
      width: 80px;
      text-align: right;
      flex-shrink: 0;
    }
    .q-field {
      flex: 1;
    }
    .q-field.q-field--readonly {
      background: #e0e0e0;
    }
  }
}
</style>
