<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { SimpleSelect } from '@/components/shared';
import { Avatar, Breadcrumbs, Drawer } from '@/components/layout';
import { useHandoverStore, useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { spaceLogin } from '@/api/user';
import { getCookie, removeCookie, setCookie } from '@/utils/helpers';
import Logo from '/images/one-heart.png';
import TestingLogo from '/images/development-one-heart.png';
import ShiftChangeReminder from '@/components/layout/ShiftChangeReminder.vue';

const userStore = useUserStore();
const handoverStore = useHandoverStore();
const { userInfo, currentSpaceId } = storeToRefs(userStore);
const router = useRouter();

const spaceOptions = userInfo.value?.spaces?.map(({ name, id }) => {
  return { label: name, value: id };
});
currentSpaceId.value = getCookie('lastSpaceId') ? +getCookie('lastSpaceId')! : spaceOptions?.[0].value ?? null;

watch(currentSpaceId, async (newSpaceId) => {
  const oriSpaceId = getCookie('lastSpaceId');

  if (!oriSpaceId || newSpaceId !== +oriSpaceId) {
    const { accessToken } = await spaceLogin({ spaceId: newSpaceId! });
    setCookie('secondToken', accessToken);
    removeCookie('lastSpaceId');
    setCookie('lastSpaceId', newSpaceId);
    router.push({ name: 'home' });
  }
}, { immediate: true });

const drawerOpen = ref(true);

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}

function logout() {
  removeCookie('firstToken');
  removeCookie('secondToken');
  removeCookie('lastSpaceId');
  router.go(0);
}

// const logoUrl = computed(() => import.meta.env.MODE === 'production' ? Logo : TestingLogo);
const logoUrl = computed(() => Logo);
</script>

<template>
  <QLayout view="hHh LpR lFf">
    <QHeader height-hint="98">
      <QToolbar>
        <div class="toolbar">
          <QBtn dense flat round icon="menu" color="on-surface-variant" @click="toggleDrawer" />
          <div class="logo"><img :src="logoUrl" style="height: 100%; width:100%; object-fit:contain"> </div>
          <SimpleSelect v-model="currentSpaceId" :options="spaceOptions" />
        </div>

        <QSpace />
        <div class="row q-gutter-lg items-center q-ml-auto">
          <Avatar @log-out="logout" />
        </div>
      </QToolbar>
    </QHeader>
    <Drawer v-model="drawerOpen" />
    <QPageContainer>
      <div class="page-box">
        <ShiftChangeReminder v-if="handoverStore.isNeedToShiftChange" @click="$router.push({ name: 'handover' })" />
        <Breadcrumbs class="q-px-lg q-py-md breadcrumb" />
        <QPage class="q-px-lg">
          <RouterView />
        </QPage>
      </div>
    </QPageContainer>
  </QLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables/breakpoints';

main.q-page {
  height: calc(100vh - 211px);
  min-height: initial !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  > *:not(.breadcrumb) {
    overflow: auto;
  }
}

.q-layout {
  display: flex;
  flex-direction: column;
}

.logo {
  height: 45px;
  display: none;
  @include rwd($md) {
    display: block;
  }
}

:deep(.q-page-container) {
  background-color: $surface;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 20px 20px 20px;
  padding-top: 86px !important;
}

.page-box {
  background-color: white;
  border-radius: 28px;
  flex-grow: 1;
  overflow: hidden;
}

.q-header {
  padding: 12px 20px;
  background-color: $surface;
}

.q-toolbar {
  padding: 0;
}

.toolbar {
  // padding: 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

:deep(.q-toolbar .q-btn__content) {
  padding: 12px;
}
</style>
