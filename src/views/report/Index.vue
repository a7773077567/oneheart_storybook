<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = [
  // { name: 'appointmentExport', label: '預約單' },
  // { name: 'firstVisitExport', label: '初診客戶' },
  { name: 'payrollExport', label: '治療師薪資報表' },
  { name: 'coachPayrollExport', label: '教練薪資報表' },
  { name: 'payrollExport4HR', label: '治療師薪資報表 For HR' },
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
    <h3 class="q-py-md q-pl-xs text-headline-small">匯出報表</h3>
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
    <div class="report_export--page">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.report_export {
  &--page {
    padding: 24px;
  }
}
</style>
