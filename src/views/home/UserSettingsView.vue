<script setup lang="ts">
import { newPasswordSchema, updatePassword } from '@/api';
import { useUserStore } from '@/stores';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { removeCookie } from '@/utils/helpers';
import { useRouter } from 'vue-router';
import { useMsal } from '@/composables/msal';
import { googleTokenLogin } from 'vue3-google-login';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const { loginPopup: mslLoginPopup } = useMsal();
const { name, role, email } = userStore.userInfo!;
const stateOfResetDialog = ref(false);
const showPwd = ref(false);
const showConfirm = ref(false);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(newPasswordSchema),
});

const onSubmit = handleSubmit(async (values) => {
  await updatePassword({ password: values.password });
  $q.dialog({
    title: '密碼設定成功',
    message: '確認後重新登入',
  }).onOk(() => {
    removeCookie('firstToken');
    router.push({ name: 'home' });
  });
});

const upper = [
  { key: '姓名', val: name },
  { key: '職稱', val: role.name },
  { key: '帳號', val: email, span: true },
  { key: '密碼', val: '********' },

];

async function bindMicrosoft() {
  const { idToken, account, uniqueId } = await mslLoginPopup();
  console.log('🚀  bindMicrosoft  uniqueId:', uniqueId);

  console.log('🚀  bindMicrosoft  account:', account);

  console.log('🚀  bindMicrosoft  idToken:', idToken);
}

async function googleLogin() {
  const res = await googleTokenLogin();
  console.log('🚀  googleLogin  res:', res);
}
</script>

<template>
  <div class="user-settings">
    <div v-for="item in upper" :key="item.key" class="col" :class="{ 'col--span': item.span }">
      <div class="col__item--key">
        {{ item.key }}
      </div>
      <div class="col__item--val">
        {{ item.val }}
      </div>
    </div>
    <div class="col--password">
      <QBtn label="修改密碼" dense padding="0 14px" style="height: 36px;" @click="stateOfResetDialog = true" />
    </div>
    <div class="col--span">
      <QBtn label="綁定Microsoft帳號登入" icon="img:/images/microsoft.png" icon-right="" align="between" color="grey-9" outline style="width: 100%;" @click="bindMicrosoft" />
    </div>
    <div class="col--span">
      <QBtn label="綁定Google帳號登入" icon="img:/images/google.png" icon-right="" align="between" color="grey-9" outline style="width: 100%;" @click="googleLogin" />
    </div>
    <QDialog v-model="stateOfResetDialog" persistent>
      <div class="reset-password">
        <div class="reset-password__header">
          <p style="padding: 5px 0 ; text-align: center; font-size: 18px;">
            密碼修改
          </p>
        </div>
        <div class="reset-password__body">
          <OInput name="password" label="輸入新密碼" :type="showPwd ? 'text' : 'password'" class="gutter--sm">
            <template #append>
              <QIcon
                :name="showPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPwd = !showPwd"
              />
            </template>
          </OInput>
          <OInput name="confirmPassword" label="確認密碼" :type="showConfirm ? 'text' : 'password'" class="gutter--sm">
            <template #append>
              <QIcon
                :name="showConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </OInput>
          <QBtn label="確定" unelevated color="black" class="gutter--sm" style="width: 100%;" @click="onSubmit" />
          <QBtn label="取消" unelevated color="black" style="width: 100%;" @click="stateOfResetDialog = false" />
        </div>
      </div>
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.user-settings {
  width: 596px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
}
.col {
  display: flex;
  &--span {
    @extend .col;
    grid-column: span 2;
  }
  &--password {
    @extend .col;
    align-items: center;
    display: flex;
  }
  &__item {
    padding: 14px 10px;
    &--key {
      @extend .col__item;
      flex-basis: 105px;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 5px;
        width: 1px;
        height: 20px;
        background-color: black;
        top: 50%;
        translate: 0 -50%;
      }
    }
    &--val {
      @extend .col__item;
      flex-grow: 1;
    }
  }
}

.reset-password {
  background-color: #fff;
  width: 480px;
  &__header {
    padding: 5px 0;
  }
  &__body {
    padding: 20px 48px;
  }
}
</style>
