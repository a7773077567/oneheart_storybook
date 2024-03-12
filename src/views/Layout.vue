<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { Avatar, Breadcrumbs, Drawer } from '@/components/layout';

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
        <Avatar />
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

</style>
