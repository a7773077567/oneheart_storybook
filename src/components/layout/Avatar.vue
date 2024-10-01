<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores';

defineEmits<{
  logOut: [];
}>();

const userStore = useUserStore();
const router = useRouter();

function goUserSettings() {
  router.push({ name: 'userSettings' });
}
</script>

<template>
  <QAvatar class="cursor-pointer">
    <img :src="userStore?.userInfo?.avatarUrl ?? ''">
    <QMenu style="border-radius: 20px;">
      <QCard class="q-pa-md bg-grey-1" style="width: 270px">
        <QCardSection class="column flex-center q-gutter-sm q-pa-none">
          <span class="text-body2 text-grey-9">
            {{ userStore.userInfo?.email }}
          </span>
          <QAvatar size="80px">
            <img :src="userStore?.userInfo?.avatarUrl ?? ''">
          </QAvatar>
        </QCardSection>
        <QCardActions vertical>
          <QBtn label="編輯" color="white" unelevated text-color="black" rounded class="q-mb-xs" @click="goUserSettings" />
          <QBtn label="登出" color="white" unelevated text-color="black" rounded @click="() => $emit('logOut')" />
        </QCardActions>
      </QCard>
    </QMenu>
  </QAvatar>
</template>

<style lang="scss" scoped>
:deep(.q-field__native) {
  justify-content: center;
}
</style>
