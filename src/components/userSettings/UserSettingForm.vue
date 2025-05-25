<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PTLevel, RoleType, createUser, fetchSpaces, fetchUsers, updateUser, uploadAvatar } from '@/api';
import type { CreateUser, UpdateUser } from '@/api';
import { useForm } from 'vee-validate';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores';
import { extractUuidFromS3Url } from '@/utils/helpers';
import { omit } from 'radash';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import dayjs from 'dayjs';

const props = defineProps<{
  type: 'add' | 'edit';
  userId?: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const $q = useQuasar();
const userStore = useUserStore();
const targetUser = computed(() => userStore.targetUser!);

// get data
const [spaces, users] = await Promise.all([fetchSpaces(), fetchUsers({ spaceIds: [userStore.currentSpaceId!] })]);

const weightForOrderOptions = [...Array(10).fill(1).map((item, idx) => ({ label: `${item + idx}`, value: item + idx })), { label: '99', value: 99 }];
const roleIdOptions = [
  { label: '管理者', value: RoleType['系統管理者'] },
  { label: '院長 ', value: RoleType['院長'] },
  { label: '副院長 ', value: RoleType['副院長'] },
  { label: '物理治療師組長 ', value: RoleType['物理治療師組長'] },
  { label: '物理治療師 ', value: RoleType['物理治療師'] },
  { label: '店長 ', value: RoleType['店長'] },
  { label: '副店長 ', value: RoleType['副店長'] },
  { label: '教練組長 ', value: RoleType['教練組長'] },
  { label: '教練 ', value: RoleType['教練'] },
  { label: '櫃檯 ', value: RoleType['櫃檯'] },
];
const spaceOptions = spaces.map(space => ({ label: space.name, value: space.id }));
const usersOptions = users.map(user => ({ label: user.name, value: user.id }));
const avatarPreviewFile = ref<File | null>();
const avatarPreviewUrl = computed(() => {
  if (!avatarPreviewFile.value) {
    return targetUser.value.avatarUrl ?? '/images/user-avatar.png';
  }
  return URL.createObjectURL(avatarPreviewFile.value);
});

const classOptions = Array(7).fill(1).map((level, idx) => ({ label: `S${level + idx}`, value: level + idx }));
const PTLevelOptions = Object.keys(PTLevel).slice(8, 16).map(level => ({ label: level, value: PTLevel[level as keyof typeof PTLevel] }));

const addInitialValues = computed(() => ({
  name: '',
  email: '',
  weightForOrder: weightForOrderOptions[0].value,
  roleId: roleIdOptions[0].value,
  spaceIds: [spaceOptions[0].value],
  description: '',
  jobClass: null,
  PTLevel: PTLevelOptions[0].value,
  hireDate: dayjs().format('YYYY-MM-DD'),
  introducerUserId: null,
  ancestorUserId: null,
  baseSalary: 0,
}));

const editInitialValues = computed(() => ({
  name: targetUser.value.name,
  email: targetUser.value.email,
  weightForOrder: targetUser.value.weightForOrder, // temporary
  roleId: targetUser.value.role?.id,
  spaceIds: targetUser.value.spaces.map(space => space.id),
  description: targetUser.value.description,
  avatar: targetUser.value.avatarUrl,
  jobClass: targetUser.value.jobClass,
  PTLevel: targetUser.value.PTLevel,
  hireDate: targetUser.value.hireDate,
  introducerUserId: targetUser.value?.introducer?.id,
  ancestorUserId: targetUser.value?.ancestor?.id,
  baseSalary: targetUser.value.baseSalary ?? 0,
}));
const targetInitialValues = computed(() => props.type === 'add' ? addInitialValues.value : editInitialValues.value);

const isTherapist = (roleId: RoleType) => roleId === RoleType['物理治療師'] || roleId === RoleType['物理治療師組長'] || roleId === RoleType['院長'] || roleId === RoleType['副院長'];
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email('請輸入正確格式的email'),
  weightForOrder: z.number(),
  description: z.string(),
  roleId: z.number(),
  spaceIds: z.number().array(),
  avatar: z.string().nullish(),
  jobClass: z.number().nullish(),
  PTLevel: z.number().nullish(),
  hireDate: z.string(),
  introducerUserId: z.number().nullish(),
  ancestorUserId: z.number().nullish(),
  baseSalary: z.number(),
}).refine((data) => {
  // 初診等級只有在帳號職位是「治療師、院長、副院長」時會出現（必填）
  if (isTherapist(data.roleId)) {
    return !!data.jobClass;
  }
  return true;
}, {
  message: '初診等級必填',
  path: ['jobClass'], // path of error
})
  .refine((data) => {
  // PT等級只有在帳號職位是「治療師、院長、副院長」時會出現（必填）
    if (isTherapist(data.roleId)) {
      return !!data.PTLevel;
    }
    return true;
  }, {
    message: '職等等級必填',
    path: ['PTLevel'], // path of error
  });

const { handleSubmit, values, setFieldValue } = useForm<CreateUser>({
  initialValues: targetInitialValues.value,
  validationSchema: toTypedSchema(createUserSchema),
});

const isTherapistSelected = computed(() => isTherapist(values.roleId));

const onSubmit = handleSubmit(async (values) => {
  let avatarUuid = null;

  if (avatarPreviewFile.value) {
    const fileName = await uploadAvatar(targetUser.value.id, avatarPreviewFile.value);
    avatarUuid = extractUuidFromS3Url(fileName);
  }

  try {
    if (props.type === 'add') {
      let neededValues = values;
      // PT等級只有在帳號職位是「治療師、院長、副院長」時會出現（必填）
      if (!isTherapist(values.roleId)) {
        neededValues = omit(values as UpdateUser, ['PTLevel', 'jobClass']);
      }
      await createUser(neededValues);
      emit('submit');
    }
    else {
      let neededValues = { ...omit(values as UpdateUser, ['avatar']) };
      if (!isTherapist(values.roleId)) {
        neededValues = omit(values as UpdateUser, ['PTLevel', 'jobClass', 'avatar']);
      }

      const payload = {
        ...neededValues,
        ...(avatarUuid && { avatar: avatarUuid }),
      };
      await updateUser(targetUser.value.id, payload);
      $q.dialog({
        message: '更新成功',
      }).onOk(async () => {
        await userStore.getUserInfo();
        emit('submit');
      });
    }
  }
  catch (err) {
    console.log(err);
  }
});

// remove jobclass value is not 物理治療師, 院長, 副院長
watch(() => values.roleId, () => {
  if (!isTherapistSelected.value) {
    setFieldValue('jobClass', null);
    setFieldValue('PTLevel', null);
  }
});
</script>

<template>
  <div class="user-settings row q-col-gutter-md">
    <div class="user-settings__form col-9">
      <div class="form">
        <OInput name="name" inside-label="姓名*" error-message="" />
        <OInput type="email" name="email" inside-label="帳號 Email*" error-message="" />
        <OInput date-mode name="hireDate" inside-label="到職期間*" error-message="" />
        <OSelect name="roleId" label="職稱*" :options="roleIdOptions" error-message="" />
        <OSelect v-if="userStore.canI('READ_PT_LEVEL') && isTherapistSelected" :disable="!userStore.canI('EDIT_PT_LEVEL')" name="PTLevel" label="職階*" :options="PTLevelOptions" error-message="" />
        <OSelect name="weightForOrder" label="權重*" :options="weightForOrderOptions" error-message="" />
        <template v-if="isTherapistSelected">
          <OSelect name="jobClass" label="初診等級*" :options="classOptions" error-message="" hide-bottom-space />
          <p class="note">初診等級 S1 為最低，S7 為最高。等級將影響治療師的預約自動推薦 KPI 達標率。</p>
        </template>
        <OInput name="baseSalary" inside-label="本薪*" error-message="" type="number" />
        <OSelect name="ancestorUserId" label="師傅(選填)" :options="usersOptions" error-message="" />
        <OSelect name="introducerUserId" label="推薦人(選填)" :options="usersOptions" error-message="" />
        <OSelect multiple name="spaceIds" label="場館*" :options="spaceOptions" error-message="" />
        <OInput type="textarea" name="description" inside-label="描述" error-message="" />
      </div>
      <div class="user-settings__actions">
        <QBtn label="儲存" outline style="width: 126px;" @click="onSubmit" />
      </div>
    </div>
    <div v-if="type === 'edit'" class="avatar col-3">
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
</template>

<style lang="scss" scoped>
.user-settings {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  &__form {
    // width: 100%;
    // max-width: 556px;
    display: flex;
    flex-direction: column;
    gap: 45px;
  }
  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.note {
  @include text-style($body-small, $on-surface-variant);
  margin: 8px 0 12px 16px;
}
</style>
