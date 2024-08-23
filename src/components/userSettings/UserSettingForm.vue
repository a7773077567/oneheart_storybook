<script setup lang="ts">
import { computed, ref } from 'vue';
import { type CreateUser, type UpdateUser, createUser, fetchSpaces, getAvatarS3Info, resendActivateEmail, suspendUser, updateUser, uploadAvatar } from '@/api';
import { useForm } from 'vee-validate';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores';
import { extractUuidFromS3Url } from '@/utils/helpers';
import { omit } from 'radash';
import { useRouter } from 'vue-router';

const props = defineProps<{
  type: 'add' | 'edit';
  userId?: string;
}>();

const spaces = await fetchSpaces();

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const targetUser = computed(() => userStore.targetUser!);
const state = computed(() => targetUser.value.state);
const weightForOrderOptions = [...Array(10).fill(1).map((item, idx) => ({ label: `${item + idx}`, value: item + idx })), { label: '99', value: 99 }];
const roleIdOptions = [
  { label: '管理者', value: 1 },
  { label: '櫃檯', value: 2 },
];
const spaceOptions = spaces.map(space => ({ label: space.name, value: space.id }));
const avatarPreviewFile = ref<File | null>();
const avatarPreviewUrl = computed(() => {
  if (!avatarPreviewFile.value) {
    return targetUser.value.avatarUrl ?? '/images/user-avatar.png';
  }
  return URL.createObjectURL(avatarPreviewFile.value);
});

interface Input {
  element: 'input';
  label: string;
  name: string;
  type: 'text' | 'textarea';
  fluid?: boolean;
}

interface Select {
  element: 'select';
  label: string;
  name: string;
  options: {
    label: string;
    value: any;
  }[];
  fluid?: boolean;
  multiple?: boolean;
  maxSelection?: number;
}

type FormItem = Input | Select;

const formItems: FormItem[] = [
  { label: '姓名', name: 'name', element: 'input', type: 'text' },
  { label: '權重', name: 'weightForOrder', element: 'select', options: weightForOrderOptions },
  { label: '職稱', name: 'roleId', element: 'select', options: roleIdOptions },
  { label: '場館', name: 'spaceIds', element: 'select', options: spaceOptions, multiple: true, maxSelection: 1 },
  { label: '帳號', name: 'email', element: 'input', type: 'text', fluid: true },
  { label: '描述', name: 'description', element: 'input', type: 'textarea', fluid: true },
];

const addInitialValues = computed(() => ({
  name: '',
  email: '',
  weightForOrder: weightForOrderOptions[0].value,
  roleId: roleIdOptions[0].value,
  spaceIds: [spaceOptions[0].value],
  description: '',
}));

const editInitialValues = computed(() => ({
  name: targetUser.value.name,
  email: targetUser.value.email,
  weightForOrder: targetUser.value.weightForOrder, // temporary
  roleId: targetUser.value.role?.id,
  spaceIds: targetUser.value.spaces.map(space => space.id),
  description: targetUser.value.description,
  avatar: targetUser.value.avatarUrl,
}));
const targetInitialValues = computed(() => props.type === 'add' ? addInitialValues.value : editInitialValues.value);

const { handleSubmit, resetForm } = useForm<CreateUser>({
  initialValues: targetInitialValues.value,
});
const onSubmit = handleSubmit(async (values) => {
  let avatarUuid = null;

  if (avatarPreviewFile.value) {
    const fileName = await uploadAvatar(targetUser.value.id, avatarPreviewFile.value);
    avatarUuid = extractUuidFromS3Url(fileName);
  }
  const neededValues = omit(values, ['avatar']);
  const payload = {
    ...neededValues,
    ...(props.type === 'edit' && avatarUuid && { avatar: avatarUuid }),
  };
  try {
    if (props.type === 'add') {
      await createUser(payload);
      router.push({ name: 'activateEmail' });
    }
    else {
      await updateUser(targetUser.value.id, payload);
      $q.dialog({
        message: '更新成功',
      }).onOk(async () => {
        await userStore.getUsers(); // temporary
        await userStore.getUser(+props.userId!);

        resetForm({ values: targetInitialValues.value });
      });
    }
  }
  catch (err) {
    console.log(err);
  }
});

async function onSuspend() {
  await suspendUser(+props.userId!, !targetUser.value.isSuspended);
  await userStore.getUsers(); // temporary
  await userStore.getUser(+props.userId!);
  resetForm({ values: targetInitialValues.value });
}

async function onResend() {
  try {
    await resendActivateEmail(targetUser.value.id);
    router.push({ name: 'activateEmail' });
  }
  catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div class="user-settings">
    <div v-if="type === 'edit' " class="user-settings__header">
      <div :class="[state === 1 ? 'state' : 'state--active']">
        開通
      </div>
      <div v-if="targetUser.isSuspended" class="suspend">
        停權中
      </div>
    </div>
    <div class="user-settings__body">
      <div class="user-settings__form">
        <div class="form">
          <div v-for="(input, idx) in formItems" :key="idx" :class="[input.fluid ? 'form__item--fluid' : 'form__item']">
            <div class="input">
              <div class="input__item--key">
                {{ input.label }}
              </div>
              <div class="input__item--val">
                <OInput v-if="input.element === 'input'" :type="input.type" :name="input.name" hide-bottom-space borderless :outlined="false" />
                <OSelect v-else :name="input.name" :options="input.options" :multiple="input.multiple" :max-values="input.maxSelection" dense hide-bottom-space borderless :outlined="false" />
              </div>
            </div>
          </div>
        </div>
        <div class="user-settings__actions">
          <div v-if="type === 'edit'" class="row q-gutter-md">
            <QBtn v-if="targetUser.state === 1" label="重寄驗證信" outline style="width: 126px;" @click="onResend" />
            <QBtn :label="targetUser.isSuspended ? '解除停權' : '停權'" outline style="width: 126px;" @click="onSuspend" />
          </div>
          <QBtn label="完成" outline style="width: 126px;" @click="onSubmit" />
        </div>
      </div>
      <div v-if="type === 'edit'" class="avatar">
        <QAvatar size="120px">
          <img :src="avatarPreviewUrl">
        </QAvatar>
        <div class="avatar__btn">
          <div class="uploader">
            <QFile v-model="avatarPreviewFile" class="uploader__file" />
            <QBtn :label="targetUser.avatarUrl ? '更換照片' : '上傳照片'" outline class="uploader__btn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-settings {
  padding: 20px 0;
  &__header {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  &__body {
    display: flex;
    justify-content: space-between;
    max-width: 804px;
  }
  &__form {
    width: 100%;
    max-width: 556px;
    display: flex;
    flex-direction: column;
    gap: 45px;
  }
  &__actions {
    display: flex;
    justify-content: space-between;
  }
}

.state {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 10px;
  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #e86969;
  }
  &--active {
    @extend .state;
    &::after {
      background-color: #91d0c1;
    }
  }
}

.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  column-gap: 10px;
  &__item {
    &--fluid {
      @extend .form__item;
      grid-column: span 2;
    }
  }
}

.input {
  display: flex;
  &__item {
    border: 1px solid #79747e;
    &--key {
      @extend .input__item;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
    &--val {
      @extend .input__item;
      flex-grow: 1;
      padding-left: 10px;
    }
  }
}

.avatar {
  display: flex;
  flex-direction: column;
  &__btn {
    translate: 0 -12px;
    display: flex;
    justify-content: center;
  }
}

.uploader {
  position: relative;

  &__file {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }
  &__btn {
    border-radius: 8px;
    background-color: white !important;
  }
}

.suspend {
  color: #e86969;
}
</style>
