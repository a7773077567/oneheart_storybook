<script setup lang="ts">
import { UserSettingForm, UserStateControl } from '@/components/userSettings';
import { useUserStore } from '@/stores';

const props = defineProps<{
  userId: string;
}>();

const userStore = useUserStore();
await userStore.getUser(+props.userId);
</script>

<template>
  <div class="row">
    <UserStateControl v-if="userStore.targetUser" :user-info="userStore.targetUser" class="col-9 q-px-md" />
  </div>
  <QSeparator class="q-my-lg" style="width: 75%" />

  <h2 class="text-h6">編輯資料</h2>
  <UserSettingForm type="edit" :user-id="userId" />
</template>

<style lang="scss" scoped>

</style>
