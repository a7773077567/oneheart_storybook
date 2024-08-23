<script setup lang='ts'>
import { getClientInfo } from '@/api';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { Associations, BasicInfo, GCVoucher, InbodyRecords, PointsGroup, PurchaseRecords } from '@/components/client';

defineProps<{
  clientId: string;
}>();

const clientId = useRoute().params.clientId as string;

const tabs = [
  { name: 'basicInfo', label: '客戶資料', component: BasicInfo },
  { name: 'associations', label: '常用人員', component: Associations },
  { name: 'pointsGroup', label: '群組與堂數', component: PointsGroup },
  { name: 'purchaseRecords', label: '消費歷程', component: PurchaseRecords },
  { name: 'inbodyRecords', label: '身體組成表', component: InbodyRecords },
  { name: 'groupClassVoucher', label: '團課券', component: GCVoucher },
];
const currentTab = ref(tabs[0].name);
</script>

<template>
  <QTabs
    v-model="currentTab"
    align="left"
    dense
  >
    <QTab
      v-for="(tab, idx) in tabs"
      :key="idx"
      :name="tab.name"
      :label="tab.label"
    />
  </QTabs>
  <QCard flat bordered class="tab_content">
    <QTabPanels
      v-model="currentTab"
      animated
    >
      <QTabPanel
        v-for="(tab, idx) in tabs"
        :key="idx"
        :name="tab.name"
      >
        <KeepAlive>
          <Suspense>
            <component :is="tab.component" :client-id="clientId" />
          </Suspense>
        </KeepAlive>
      </QTabPanel>
    </QTabPanels>
  </QCard>
</template>

<style scoped lang="scss">
.tab_content {
  overflow: auto;
}
</style>
