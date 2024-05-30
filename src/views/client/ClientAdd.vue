<script setup lang="ts">
import { useForm } from 'vee-validate';
import { createClient } from '@/api';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useQuasar } from 'quasar';

const newClientSchema = z.object({
  name: z.string().min(1),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
  gender: z.string().optional(),
  identityNumber: z.string().length(10, { message: '請輸入完整號碼' }).optional(),
  birthDate: z.string().optional(),
  address: z.string().nullable().optional(),
  remark: z.string().nullable().optional(),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(newClientSchema),
});

const $q = useQuasar();
const onSubmit = handleSubmit(async (values) => {
  // 須重新確認建立客戶所需要欄位
  await createClient(values);
  $q.dialog({
    message: '新增客戶成功！',
  }).onOk(() => {
    resetForm();
  });
});
</script>

<template>
  <form class="new_client_form row q-col-gutter-md" @submit.prevent>
    <fieldset class="col-12 col-md-5">
      <span class="new_client_form--key">姓名</span>
      <OInput class="new_client_form--val" name="name" hide-bottom-space error-message="" />
    </fieldset>

    <fieldset class="col-12 col-md-5">
      <span class="new_client_form--key">電話</span>
      <OInput class="new_client_form--val" name="phone" hide-bottom-space error-message="" />
    </fieldset>
    <fieldset class="col-12 col-md-2">
      <span class="new_client_form--key">性別</span>
      <OInput class="new_client_form--val" name="gender" hide-bottom-space />
    </fieldset>

    <fieldset class="col-12 col-md-5">
      <span class="new_client_form--key">身分證</span>
      <OInput class="new_client_form--val" name="identityNumber" hide-bottom-space />
    </fieldset>

    <fieldset class="col-12 col-md-5">
      <span class="new_client_form--key">生日</span>
      <OInput date-mode class="new_client_form--val" name="birthDate" hide-bottom-space />
    </fieldset>

    <fieldset class="col-12">
      <span class="new_client_form--key">地址</span>
      <OInput class="new_client_form--val" name="address" hide-bottom-space />
    </fieldset>
    <fieldset class="col-12">
      <span class="new_client_form--key">備註</span>
      <OInput class="new_client_form--val full-width" name="remark" hide-bottom-space type="textarea" />
    </fieldset>
    <div class="new_client_form--actions">
      <QBtn label="完成" outline class="q-px-lg" @click="onSubmit" />
    </div>
  </form>
  <div />
</template>

<style scoped lang="scss">
.new_client_form {
  padding: 16px;
  fieldset {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &--key {
    width: 50px;
    text-align: end;
  }
  &--val {
    flex: 1;
  }
  &--actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
