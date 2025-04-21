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
    <QMenu :offset="[0, 12]" style="border-radius: 20px;">
      <QCard class="card">
        <QCardSection class="row flex-center">
          <QAvatar size="80px">
            <img :src="userStore?.userInfo?.avatarUrl ?? ''">
          </QAvatar>
        </QCardSection>
        <QCardSection class="mail">
          {{ userStore.userInfo?.email }}
        </QCardSection>
        <QCardActions vertical style="padding: 0;">
          <QBtn label="修改密碼" color="secondary-container" unelevated text-color="black" rounded class="btn" @click="goUserSettings" />
          <QBtn label="登出" color="secondary-container" unelevated text-color="black" rounded class="btn" @click="() => $emit('logOut')" />
        </QCardActions>
      </QCard>
    </QMenu>
  </QAvatar>
</template>

<style lang="scss" scoped>
.card {
  width: 296px;
  padding: 24px;
  background-color: $surface-bright;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mail {
  @include text-style($title-small, $on-surface);
  text-align: center;
}

.btn {
  padding: 10px 24px;
  border-radius: 100px;
  :deep(.block) {
    @include text-style($label-large, $on-secondary-container);
  }
}

:deep(.q-field__native) {
  justify-content: center;
}

:deep(.q-card__actions--vert > .q-btn-item + .q-btn-item) {
  margin-top: 12px;
}

:deep(.q-card__section--vert) {
  padding: 0;
}
</style>
