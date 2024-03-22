<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { removeCookie } from '@/utils/helpers';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();

function goUserSettings() {
  router.push({ name: 'userSettings' });
}

function logout() {
  removeCookie('firstToken');
  removeCookie('secondToken');
  router.go(0);
}
</script>

<template>
  <QAvatar class="cursor-pointer">
    <img src="https://cdn.quasar.dev/img/avatar2.jpg">
    <QMenu style="border-radius: 20px;">
      <QCard class="q-pa-md bg-grey-1" style="width: 270px">
        <QCardSection class="column flex-center q-gutter-sm q-pa-none">
          <span class="text-body2 text-grey-9">
            {{ userInfo?.email }}
          </span>
          <QAvatar size="80px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </QAvatar>
        </QCardSection>
        <QCardActions vertical>
          <QBtn label="編輯" color="white" unelevated text-color="black" rounded class="q-mb-xs" @click="goUserSettings" />
          <QBtn label="登出" color="white" unelevated text-color="black" rounded @click="logout" />
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
