<script setup lang='ts'>
import { getClientInfo } from '@/api';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { Associations, BasicInfo, InbodyRecords, PointsGroup, PurchaseRecords } from '@/components/client';

defineProps<{
  clientId: string;
}>();

const clientId = useRoute().params.clientId as string;
const data = ref();
const tabs = [
  { name: 'basicInfo', label: '客戶資料', component: BasicInfo },
  { name: 'associations', label: '常用人員', component: Associations },
  { name: 'pointsGroup', label: '群組與點數', component: PointsGroup },
  { name: 'purchaseRecords', label: '消費歷程', component: PurchaseRecords },
  { name: 'inbodyRecords', label: '身體組成表', component: InbodyRecords },
];
const currentTab = ref(tabs[0].name);

data.value = await getClientInfo(clientId);
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
  <QCard flat bordered class="info">
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
            <component :is="tab.component" />
          </Suspense>
        </KeepAlive>
      </QTabPanel>
    </QTabPanels>
  </QCard>
</template>
