<script setup lang='ts'>
import { QSeparator } from 'quasar';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = [
  { name: 'reviewBonus', label: '積分與獎金審核' },
];
const currentTab = ref(tabs[0].name);
const route = useRoute();

watch(() => route.name, (page) => {
  if (page && page !== currentTab.value) {
    currentTab.value = page as string;
  }
}, {
  immediate: true,
});
</script>

<template>
  <div class="bonus-issue">
    <QTabs
      v-model="currentTab"
      align="left"
      dense
      active-color="primary"
    >
      <QTab
        v-for="(tab, idx) in tabs"
        :key="idx"
        :name="tab.name"
        :label="tab.label"
        class="q-py-sm"
        style="text-transform: initial"
        @click="$router.push({ name: tab.name })"
      />
    </QTabs>
    <QSeparator />
    <div class="bonus-issue--page">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bonus-issue {
  height: 100%;
  &--page {
    padding: 18px 24px;
    height: calc(100% - 50px);
    overflow: hidden;
  }
}
</style>
