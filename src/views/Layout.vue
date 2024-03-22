<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { Avatar, Breadcrumbs, Drawer } from '@/components/layout';
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const locationOptions = userInfo.value?.spaces.map(({ name, id }) => {
  return { label: name, value: id };
});
const currentLocation = ref(locationOptions?.[0].value);

function optionDisable(option: any): boolean {
  return option.value === currentLocation.value;
}

const { navTabs } = useLayoutRoute();
const drawerOpen = ref(true);

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>

<template>
  <QLayout view="hHh LpR lFf">
    <QHeader elevated class="bg-primary text-white q-px-sm q-pt-sm" height-hint="98">
      <QToolbar>
        <QBtn dense flat round icon="menu" @click="toggleDrawer" />
        <QAvatar class="q-ml-lg">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </QAvatar>
        <QSpace />
        <div class="row q-gutter-lg items-center">
          <QSelect v-model="currentLocation" :options="locationOptions" map-options hide-dropdown-icon hide-bottom-space borderless :option-disable="optionDisable" />
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
        <Breadcrumbs class="gutter--sm" />
        <RouterView />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>

<style lang="scss" scoped>
:deep(.q-field__control) {
  min-height: fit-content;
}
:deep(.q-field__native) {
  min-height: fit-content;
  padding: 4.5px 38px;
  background-color: white;
  border-radius: 15px 15px 0 0;
}
</style>
