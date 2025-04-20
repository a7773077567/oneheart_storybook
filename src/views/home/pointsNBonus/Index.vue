<script setup lang='ts'>
import { ref } from 'vue';

const tabs = [
  { name: 'googleReview', label: 'Google 評論管理' },
  { name: 'educationPoints', label: '教育積分' },
];
const currentTab = ref(tabs[0].name);
</script>

<template>
  <div class="points_n_bonus">
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
    <div class="points_n_bonus--page">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.points_n_bonus {
  &--page {
    padding: 18px 24px;
  }
}
</style>
