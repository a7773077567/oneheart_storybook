<script setup lang='ts'>
import { ref } from 'vue';
import PurchasePoint from './PurchasePoint.vue';
import RefundPoint from './RefundPoint.vue';

const currentTab = ref('purchase');
const tabs = [{ name: 'purchase', label: '堂數儲值', component: PurchasePoint }, { name: 'refund', label: '退款', component: RefundPoint }];
</script>

<template>
  <QTabs
    v-model="currentTab"
    align="left"
    active-color="black"
    indicator-color="black"
  >
    <QTab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label" class="q-px-xl" />
  </QTabs>

  <QSeparator />

  <QTabPanels v-model="currentTab" animated>
    <template v-for="tab in tabs" :key="tab.name">
      <QTabPanel :name="tab.name">
        <component :is="tab.component" />
      </QTabPanel>
    </template>
  </QTabPanels>
</template>
