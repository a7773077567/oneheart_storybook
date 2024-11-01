<script setup lang="ts">
import { useForm } from 'vee-validate';
import { createClient } from '@/api';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';
import { genderOptions } from '@/const/general';
import { OMemberSearch } from '@/components/shared';

const newClientSchema = z.object({
  name: z.string().min(1),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
  gender: z.string().optional(),
  identityNumber: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  introducerClientId: z.number().nullable().optional(),
  howToKnowUs: z.string().nullable().optional(),
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

const howToKnowOptions = ['家人推薦', '朋友推薦', 'Facebook', 'Instagram', 'Youtube', 'Google map', '搜尋引擎', '實體活動', 'Threads', '賴ki', 'Ruby'];
</script>

<template>
  <section class="new_client q-mb-lg">
    <form class="row q-col-gutter-md" @submit.prevent>
      <fieldset class="col-12 col-md-6">
        <span class="label">姓名*</span>
        <OInput name="name" hide-bottom-space class="col-grow" :error="!!errors.name" error-message="" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <span class="label">電話*</span>
        <OInput name="phone" hide-bottom-space class="col-grow" :error="!!errors.phone" error-message="" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <span class="label">性別</span>
        <OSelect name="gender" hide-bottom-space :options="genderOptions" class="col-grow" style="background:white" :error="!!errors.gender" error-message="" />
      </fieldset>
      <fieldset class="col-12 col-md-6">
        <span class="label">生日</span>
        <OInput date-mode class="col-grow" name="birthDate" hide-bottom-space :error="!!errors.birthDate" error-message="" />
      </fieldset>

      <fieldset class="col-12">
        <span class="label">身分證/ <br> 居留證</span>
        <OInput name="identityNumber" hide-bottom-space class="col-grow" :error="!!errors.identityNumber" error-message="" />
      </fieldset>

      <fieldset class="col-12">
        <span class="label">地址</span>
        <OInput name="address" hide-bottom-space class="col-grow" :error="!!errors.address" error-message="" />
      </fieldset>
      <fieldset class="col-12">
        <span class="label">介紹人</span>
        <OMemberSearch name="introducerClientId" class="full-width" />
      </fieldset>
      <fieldset class="col-12">
        <span class="label">從哪裡知道我們</span>
        <OSelect name="howToKnowUs" hide-bottom-space class="full-width" :options="howToKnowOptions" :error="!!errors.howToKnowUs" error-message="" />
      </fieldset>
      <fieldset class="col-12">
        <span class="label">備註</span>
        <OInput name="note" hide-bottom-space type="textarea" class="full-width" :error="!!errors.note" error-message="" />
      </fieldset>

      <div class="new_client_form--actions">
        <QBtn label="完成" outline class="q-px-lg" color="black" @click="onSubmit" />
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
