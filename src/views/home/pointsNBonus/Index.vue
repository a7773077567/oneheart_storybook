<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = [
  { name: 'googleReview', label: 'Google 評論管理' },
  { name: 'educationPoints', label: '教育積分' },
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
