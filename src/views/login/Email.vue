<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { type ForgetReq, accountSchema, forgetPassword } from '@/api/user';
import { useCountdown } from '@/composables/timer';

const emailSent = ref(false);
let payload: ForgetReq;

let {
  left: countdownLeft,
  done: countdownDone,
  start: countdownStart,
} = useCountdown(10);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(accountSchema),
});

const onSubmit = handleSubmit(async (values) => {
  const state = await forgetPassword(values);
  console.log('🚀  onSubmit  state:', state);
  emailSent.value = true;
  payload = values;
  countdownStart();
});

async function resentEmail() {
  const { state } = await forgetPassword(payload);
  console.log('🚀  resentEmail  state:', state);
  countdownStart();
}
</script>

<template>
  <div class="email">
    <template v-if="!emailSent">
      <p class="email__title">
        請輸入註冊之電子郵件
      </p>
      <OInput name="account" label="Email" class="q-mb-md" />
      <QBtn label="確認" unelevated color="black" @click="onSubmit" />
    </template>
    <template v-else>
      <p class="email__title">
        已發新設定至電子郵件
      </p>
      <p>
        請檢查收件匣中的信件。點擊郵件中的連結以設定新的密碼。
        <span v-if="!countdownDone">({{ countdownLeft }}s)</span>
      </p>
      <QBtn label="重發設定" unelevated color="black" :disable="!countdownDone" @click="resentEmail" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.email {
  display: flex;
  flex-direction: column;
  &__title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
