<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter } from 'vue-router';
import { googleAuthCodeLogin } from 'vue3-google-login';
import { type LoginRes, basicLogin, basicLoginSchema, googleLogin, microsoftLogin } from '@/api/user';
import { setCookie } from '@/utils/helpers';
import { useMsal } from '@/composables/msal';

const router = useRouter();
const { loginPopup: mslLoginPopup } = useMsal();
const isPwd = ref(true);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(basicLoginSchema),
});
const onBasicLogin = handleSubmit(async (values) => {
  goHome(() => basicLogin(values));
});

async function onGoogleLogin() {
  const { code } = await googleAuthCodeLogin();
  goHome(() => googleLogin({ code }));
}

async function onMicrosoftLogin() {
  const { idToken } = await mslLoginPopup();
  goHome(() => microsoftLogin({ idToken }));
}

function forgetPassword() {
  router.push({ name: 'forget' });
}

async function goHome(loginFunc: () => Promise<LoginRes>) {
  const { token } = await loginFunc();
  setCookie('token', token);
  return router.push({ name: 'home' });
}
</script>

<template>
  <BasicLayout>
    <p class="title gutter">
      登入
    </p>
    <OInput name="account" label="帳號" outlined class="gutter--sm" />
    <OInput name="password" label="密碼" :type="isPwd ? 'password' : 'text'" outlined class="gutter--sm">
      <template #append>
        <QIcon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </OInput>
    <QBtn label="忘記密碼了嗎?" text-color="red-5" :ripple="false" flat dense class="self-start gutter" @click="forgetPassword" />
    <QBtn label="登入" unelevated color="black" class="gutter" @click="onBasicLogin" />
    <p class="separator gutter">
      或使用以下登入
    </p>
    <!-- icon-right prop is necessary for centering the text label  -->
    <QBtn label="使用Microsoft登入" icon="img:/images/microsoft.png" icon-right="" align="between" color="grey-7" outline class="gutter" @click="onMicrosoftLogin" />
    <QBtn label="使用Google登入" icon="img:/images/google.png" icon-right="" align="between" color="grey-7" outline @click="onGoogleLogin" />
  </BasicLayout>
</template>

<style lang="scss" scoped>
.login {
  max-width: 1440px;
  height: 100vh;
  margin: 0 auto;
  padding: 65px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &__container {
    width: 385px;
    display: flex;
    flex-direction: column;
  }
}

.separator {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  &::after {
    content: '';
    display: block;
    flex: 1 1 0;
    height: 1px;
    background-color: black;
    opacity: 0.5;
    translate: 0 2px;
  }
}

.title {
  padding: 13px 0;
  border-bottom: 1px solid black;
  text-align: center;
  font-size: 17px;
}

.gutter {
  margin-bottom: 20px;
  &--sm {
    margin-bottom: 10px;
  }
}
</style>
