<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { newPasswordSchema, resetPassword } from '@/api/user';
import { removeCookie, setCookie } from '@/utils/helpers';

interface Props {
  token: string;
}
const props = defineProps<Props>();

const router = useRouter();
const $q = useQuasar();
const showPwd = ref(false);
const showConfirm = ref(false);

setCookie('firstToken', props.token);
removeCookie('secondToken');

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(newPasswordSchema),
});

const onSubmit = handleSubmit(async (values) => {
  await resetPassword(values);

  $q.dialog({
    title: '密碼設定成功',
    message: '確認後重新登入',
  }).onOk(() => {
    removeCookie('firstToken');
    removeCookie('secondToken');
    router.push({ name: 'home' });
  });
});
</script>

<template>
  <BasicLayout>
    <p class="title gutter">
      密碼修改
    </p>
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
    <QBtn label="確定" unelevated color="black" @click="onSubmit" />
  </BasicLayout>
</template>

<style lang="scss" scoped>
.title {
  padding: 13px 0;
  border-bottom: 1px solid black;
  text-align: center;
  font-size: 17px;
}
</style>
