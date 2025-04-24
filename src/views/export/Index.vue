<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = [
  { name: 'appointmentExport', label: '預約單' },
  { name: 'firstVisitExport', label: '初診客戶' },
  { name: 'payrollExport', label: '薪水報表' },
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
  <div class="report_export">
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
    <div class="report_export--page">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.report_export {
  &--page {
    padding: 18px 24px;
  }
}
</style>
