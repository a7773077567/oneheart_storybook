<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { Avatar, Breadcrumbs, Drawer } from '@/components/layout';
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { spaceLogin } from '@/api/user';
import { getCookie, setCookie } from '@/utils/helpers';

const userStore = useUserStore();
const { userInfo, currentSpaceId } = storeToRefs(userStore);
const router = useRouter();

const spaceOptions = userInfo.value!.spaces.map(({ name, id }) => {
  return { label: name, value: id };
});
currentSpaceId.value = getCookie('lastSpaceId') ? +getCookie('lastSpaceId')! : spaceOptions[0].value;

// const currentSpaceId = ref(lastSpaceId);
watch(currentSpaceId, async (newSpaceId) => {
  const { accessToken } = await spaceLogin({ spaceId: newSpaceId! });
  setCookie('secondToken', accessToken);
  setCookie('lastSpaceId', newSpaceId);
  router.push({ name: 'home' });
});

function optionDisable(option: any): boolean {
  return option.value === currentSpaceId.value;
}

const { navTabs } = useLayoutRoute();
const drawerOpen = ref(true);

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>

<template>
  <QLayout view="hHh LpR lFf">
    <QHeader elevated class="bg-white text-black q-px-sm q-pt-sm une no-shadow" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="menu" @click="toggleDrawer" />
        <img src="/images/one-heart.png" class="q-ml-md" style="display: block; height: 45px;">
        <QSpace />
        <div class="row q-gutter-lg items-center">
          <QSelect v-model="currentSpaceId" :options="spaceOptions" emit-value map-options hide-dropdown-icon hide-bottom-space borderless :option-disable="optionDisable" class="space-selector" popup-content-class="no-border-radius" />
          <Avatar />
        </div>
      </QToolbar>
      <QTabs>
        <QRouteTab
          v-for="(tab, index) in navTabs"
          :key="index"
          :to="{ name: tab.route }"
          :label="tab.label"
        />
      </QTabs>
    </QHeader>
    <Drawer v-model="drawerOpen" />
    <QPageContainer>
      <QPage class="q-py-md q-px-lg">
        <Breadcrumbs class="gutter--sm breadcrumb" />
        <RouterView />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>

<style lang="scss" scoped>
:deep(.space-selector) {
  .q-field__control {
    min-height: fit-content;
  }
  .q-field__native {
    min-height: fit-content;
    padding: 4.5px 38px;
    background-color: #ddd;
    border-radius: 15px 15px 0 0;
  }
}
main.q-page {
  height: calc(100vh - 106px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > *:not(.breadcrumb) {
    overflow: auto;
  }
}
</style>
