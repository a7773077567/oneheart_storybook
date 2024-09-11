<script setup lang='ts'>
import { computed } from 'vue';
import { AccountState, type User, WorkState, resendActivateEmail, resignUser, suspendUser } from '@/api';

import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores';

const props = defineProps<{
  userInfo: User;
}>();

// 顯示順序：離職 > 停權 > 未開通、開通
interface State {
  matched: boolean;
  stateLabel: keyof typeof AccountState | keyof typeof WorkState;
  class: string;
}
const displayStateOrder = computed(() => {
  const stateList: State[] = [
    {
      matched: props.userInfo.stateOfWork === WorkState['離職'],
      stateLabel: '離職',
      class: 'state--resigned',
    },
    {
      matched: props.userInfo.stateOfWork === WorkState['停權'],
      stateLabel: '停權',
      class: 'state--banned',
    },
    {
      matched: props.userInfo.stateOfWork === WorkState['在職'],
      stateLabel: AccountState[props.userInfo.state] as keyof typeof AccountState,
      class: props.userInfo.state === AccountState['開通'] ? 'state--active' : '',
    },
  ];

  return stateList.find(state => state.matched) ?? stateList[0];
});

const $q = useQuasar();
const userStore = useUserStore();

async function handleResend() {
  await resendActivateEmail(props.userInfo.id);
  $q.notify({ message: '已重寄驗證信', timeout: 200, position: 'center' });
}

async function handleResign(isResign: boolean) {
  await resignUser(props.userInfo.id, isResign);
  await userStore.getUser(props.userInfo.id);
  $q.notify({ message: `設定${isResign ? '離職' : '復職'}成功`, timeout: 200, position: 'center' });
}

async function handleSuspend(isSuspended: boolean) {
  await suspendUser(props.userInfo.id, isSuspended);
  await userStore.getUser(props.userInfo.id);
  $q.notify({ message: `${isSuspended ? '設定停權' : '解除停權'}成功`, timeout: 200, position: 'center' });
}
</script>

<template>
  <div class="user-state">
    <div class="user-state__val flex items-center">
      <span>{{ displayStateOrder.stateLabel }}</span>
      <div class="state" :class="displayStateOrder.class" />
    </div>
    <div class="user-state__actions">
      <div class="row q-gutter-md">
        <template v-if="displayStateOrder.stateLabel === '離職'">
          <QBtn label="停權" disable outline color="grey-13" />
          <QBtn label="復職" outline @click="handleResign(false)" />
        </template>
        <template v-else-if="displayStateOrder.stateLabel === '停權'">
          <QBtn label="解除停權" outline @click="handleSuspend(false)" />
          <QBtn label="離職" outline @click="handleResign(true)" />
        </template>
        <template v-else>
          <QBtn v-if="displayStateOrder.stateLabel === '未開通'" label="重寄驗證信" outline @click="handleResend" />
          <QBtn label="停權" outline @click="handleSuspend(true)" />
          <QBtn label="離職" outline @click="handleResign(true)" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-state {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__val {
    font-size: 16px;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    .q-btn {
      width: 120px;
    }
  }
  .state {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #e86969;
    margin-left: 20px;
    &--active {
      background-color: #91d0c1;
    }
    &--banned {
      background-color: #f0a754;
    }
    &--resigned {
      background-color: #b3b3b3;
    }
  }
}
</style>
