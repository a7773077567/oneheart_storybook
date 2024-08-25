<script setup lang='ts'>
import { ref } from 'vue';
import PurchaseVoucher from './PurchaseVoucher.vue';
import RefundVoucher from './RefundVoucher.vue';

const currentTab = ref('purchase');
const tabs = [{ name: 'purchase', label: '購買', component: PurchaseVoucher }, { name: 'refund', label: '退款', component: RefundVoucher }];
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
