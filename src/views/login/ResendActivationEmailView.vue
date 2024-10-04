<script setup lang="ts">
import { resendActivateEmail } from '@/api/user';
import { useCountdown } from '@/composables/timer';

const {
  left: countdownLeft,
  done: isCountdownDone,
  start: countdownStart,
} = useCountdown(10);

countdownStart();

async function resendEmail() {
  await resendActivateEmail(2);
  countdownStart();
}
</script>

<template>
  <BasicLayout>
    <div class="email">
      <p class="email__title">
        確認電子郵件以繼續
      </p>
      <p>
        請檢查收件匣中的確認信件。點擊郵件中的連結以確認電子郵件地址。
        <span v-if="!isCountdownDone">({{ countdownLeft }}s)</span>
      </p>
      <QBtn label="重發註冊" unelevated color="black" :disable="!isCountdownDone" @click="resendEmail" />
    </div>
  </BasicLayout>
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
