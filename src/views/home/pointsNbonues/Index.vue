<script setup lang='ts'>
import { QSeparator } from 'quasar';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = [
  { name: 'googleReview', label: 'Google 評論管理' },
  { name: 'educationPoints', label: '教育積分' },
  { name: 'relocationBonus', label: '外派獎金' },
  { name: 'writingAllowance', label: '寫作津貼' },
  { name: 'trainingAllowance', label: '培訓津貼' },
  { name: 'supportBonus', label: '支援獎金' },
  { name: 'otherAllowance', label: '其他津貼' },
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
    <QSeparator />
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
