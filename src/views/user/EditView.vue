<script setup lang="ts">
import { UserSettingForm } from '@/components/userSettings';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { getUserAccountState } from '@/utils/mappers';
import { resendActivateEmail, resignUser, suspendUser } from '@/api';
import { useQuasar } from 'quasar';

const props = defineProps<{
  userId: string;
}>();

const $q = useQuasar();
const userStore = useUserStore();
await userStore.getUser(+props.userId);

const router = useRouter();
function handleSubmit() {
  userStore.getUsers(); // if nested router solved, this fetch can be removed
  router.push({ name: 'userList' });
}

// 顯示順序：離職 > 停權 > 未開通、開通
const userAccountState = computed(() => {
  if (!userStore.targetUser)
    return null;
  return getUserAccountState({ stateOfWork: userStore.targetUser.stateOfWork, state: userStore.targetUser.state });
});

async function handleResend() {
  await resendActivateEmail(userStore.targetUser!.id);
  $q.notify({ message: '已重寄驗證信', timeout: 200, position: 'center' });
}

async function handleResign(isResign: boolean) {
  await resignUser(userStore.targetUser!.id, isResign);
  await userStore.getUser(userStore.targetUser!.id);
  $q.notify({ message: `設定${isResign ? '離職' : '復職'}成功`, timeout: 200, position: 'center' });
}

async function handleSuspend(isSuspended: boolean) {
  await suspendUser(userStore.targetUser!.id, isSuspended);
  await userStore.getUser(userStore.targetUser!.id);
  $q.notify({ message: `${isSuspended ? '設定停權' : '解除停權'}成功`, timeout: 200, position: 'center' });
}
</script>

<template>
  <div class="edit-user">
    <div class="edit-user__title">
      <h3 class="text-headline-small">
        編輯人員資料
        <QChip v-if="userAccountState" square :class="userAccountState.color" class="" dense size="md">
          <div class="text-label-small flex justify-center" style="width:34px">{{ userAccountState.label }}</div>
        </QChip>
      </h3>
    </div>
    <div v-if="userAccountState" class="edit-user__action">
      <template v-if="userAccountState.label === '離職'">
        <QBtn unelevated label="停權" disable rounded color="grey-13" class="q-px-lg" />
        <QBtn unelevated label="復職" rounded color="primary" class="q-px-lg" @click="handleResign(false)" />
      </template>
      <template v-else-if="userAccountState.label === '停權'">
        <QBtn unelevated label="解除停權" color="primary" rounded class="q-px-lg" @click="handleSuspend(false)" />
        <QBtn unelevated label="離職" rounded color="error" class="q-px-lg" @click="handleResign(true)" />
      </template>
      <template v-else>
        <QBtn v-if="userAccountState.label === '未開通'" unelevated label="重寄驗證信" outline rounded color="primary" class="q-px-lg" @click="handleResend" />
        <QBtn unelevated label="停權" color="error" rounded class="q-px-lg" @click="handleSuspend(true)" />
        <QBtn unelevated label="離職" color="error" rounded class="q-px-lg" @click="handleResign(true)" />
      </template>
    </div>
  </div>
  <QSeparator class="q-mb-lg" />
  <UserSettingForm type="edit" :user-id="userId" @submit="handleSubmit" @cancel="$router.push({ name: 'userList' })" />
</template>

<style lang="scss" scoped>
.edit-user {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px 0;
  &__title {
    flex: 0 0 215px;
    h3 {
      display: flex;
      align-items: start;
      justify-content: space-between;
    }
  }
  &__action {
    white-space: nowrap;
    flex: 1;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 16px;
  }
}
</style>
