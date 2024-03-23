<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { type ForgotReq, emailSchema, forgotPassword } from '@/api/user';
import { useCountdown } from '@/composables/timer';

const emailSent = ref(false);
let payload: ForgotReq;

const {
  left: countdownLeft,
  done: countdownDone,
  start: countdownStart,
} = useCountdown(10);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(emailSchema),
});

const onSubmit = handleSubmit(async (values) => {
  await forgotPassword(values);
  emailSent.value = true;
  payload = values;
  countdownStart();
});

async function resentEmail() {
  await forgotPassword(payload);
  countdownStart();
}
</script>

<template>
  <div class="email">
    <template v-if="!emailSent">
      <p class="email__title">
        請輸入註冊之電子郵件
      </p>
      <OInput name="email" label="Email" class="q-mb-md" />
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
  gap: 20px;
  &__title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
