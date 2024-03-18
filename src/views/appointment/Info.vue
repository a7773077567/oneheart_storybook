<script setup lang="ts">
import { computed, ref } from 'vue';
import { TabMap, Types } from '@/const/general';
import type Module from 'node:module';

interface Props {
  type: string;
}
const props = defineProps<Props>();

const tabs = computed(() => getTabs());

const currentTab = ref('clientInfo');
const recordModules = getRecordModules();

function getTabs() {
  const types = Object.values(Types);
  const tabNames = types[+props.type].tabs;
  const tabs = tabNames.map(item => ({
    name: item,
    label: TabMap.get(item),
  }));
  return tabs;
}

function getRecordModules() {
  const modules = import.meta.glob('@/components/appointment/records/*.vue', { eager: true });
  const newModulesEntries = Object.entries(modules).map(mapFunc);
  return Object.fromEntries(newModulesEntries);

  function mapFunc(entry: [string, any]) {
    const [key, value] = entry;
    const moduleName = trimKey(key)!;
    const newKey = unCapitalize(moduleName);
    return [newKey, value.default];
  }
  function trimKey(key: string) {
    return key.split('/').at(-1)?.split('.')[0];
  }
  function unCapitalize(string: string) {
    return string[0].toLocaleLowerCase() + string.slice(1);
  }
}
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
    >
      <QTabPanel
        v-for="(tab, idx) in tabs"
        :key="idx"
        :name="tab.name"
      >
        <component :is="recordModules[tab.name]" />
      </QTabPanel>
    </QTabPanels>
  </QCard>
</template>

<style lang="scss" scoped>

</style>q
