<script setup lang="ts">
import { computed, ref } from 'vue';
import { TabMap, Types } from '@/const/general';
import { useAppointmentStore } from '@/stores';

const props = defineProps<{
  scheduleId: string;
}>();

const appointmentStore = useAppointmentStore();
await appointmentStore.getClientSchedule(+props.scheduleId);
const userShiftType = computed(() => appointmentStore.targetClientSchedule?.userShift.type);
const tabs = computed(() => getTabs());

const currentTab = ref('clientInfo');
const recordModules = getRecordModules();
const hasSignedFirstContract = computed(() => !!appointmentStore.targetClientSchedule?.hasSignedFirstContract);

function getTabs() {
  const types = Object.values(Types);
  const tabs = types.find(type => type.identifier === userShiftType.value)!.tabs;
  return tabs.map(item => ({
    name: item,
    label: TabMap.get(item),
  }));
}

function getRecordModules() {
  const modules = import.meta.glob('@/components/appointment/records/*.vue', { eager: true });
  const newModulesEntries = Object.entries(modules).map(mapFunc);
  return Object.fromEntries(newModulesEntries);

  // Transform the key from file path to file name
  function mapFunc(entry: [string, any]) {
    const [key, value] = entry;
    const moduleName = trimKey(key)!;
    const newKey = unCapitalize(moduleName);
    return [newKey, value.default];

    function trimKey(key: string) {
      return key.split('/').at(-1)?.split('.')[0];
    }
    function unCapitalize(string: string) {
      return string[0].toLocaleLowerCase() + string.slice(1);
    }
  }
}

function handleSign() {
  console.log('sign contract');
}
</script>

<template>
  <QBtn label="返回" icon="chevron_left" color="primary" flat style="width: fit-content; margin: 4px 0; padding: 4px 8px; " @click="$router.back" />
  <QTabs v-model="currentTab" align="left" dense>
    <QTab v-for="(tab, idx) in tabs" :key="idx" :name="tab.name" :label="tab.label" />
  </QTabs>
  <QCard flat bordered class="info">
    <QTabPanels v-model="currentTab" animated>
      <QTabPanel v-for="(tab, idx) in tabs" :key="idx" :name="tab.name">
        <KeepAlive>
          <Suspense>
            <div>
              <div v-if="!hasSignedFirstContract" class="first_contract_banner">
                <QBtn disable icon="warning" round unelevated color="orange-3" text-color="red-8" class="q-mr-sm" style="cursor: default;" />
                <p>需簽署「就診須知合約」才能報到並進行後續治療服務</p>
                <QBtn label="簽約" unelevated rounded color="primary" class="q-ml-auto" @click="handleSign" />
              </div>
              <component :is="recordModules[tab.name]" :schedule-id="+scheduleId" :schedule-detail="appointmentStore.targetClientSchedule" />
            </div>
          </Suspense>
        </KeepAlive>
      </QTabPanel>
    </QTabPanels>
  </QCard>
</template>

<style lang="scss" scoped>
.info {
  flex: 1;
  height: 0;
  .q-tab-panels {
    height: 100%;
  }
  .first_contract_banner {
    background: #fddda9;
    padding: 8px 16px;
    display: flex;
    align-items: center;
  }
}
</style>
