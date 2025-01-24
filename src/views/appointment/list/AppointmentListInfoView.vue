<script setup lang="ts">
import { computed, ref } from 'vue';
import { MachineShifts, MachineTypes, ShiftType, TabMap, Types } from '@/const/general';
import { MachineContractMapping } from '@/const/contracts';
import { useAppointmentStore } from '@/stores';
import { ContractTypes, getContractShareLink } from '@/api';
import { Dialog, Loading, QBadge } from 'quasar';
import { GenericDialog } from '@/components/shared';

const props = defineProps<{
  scheduleId: string;
}>();

const appointmentStore = useAppointmentStore();
await appointmentStore.getClientSchedule(+props.scheduleId);
const userShiftType = computed(() => appointmentStore.targetClientSchedule?.userShift.type);
const tabs = computed(() => getTabs());

const currentTab = ref('clientInfo');
const recordModules = getRecordModules();

const includesMagneticMachineTreatment = computed(() => (appointmentStore.targetClientSchedule?.machines ?? []).map(m => m.type).includes(MachineTypes['磁波儀器治療']));

function getTabs() {
  const types = Object.values(Types);
  const tabs = types.find(type => type.identifier === userShiftType.value)!.tabs;
  return tabs.map(item => ({
    name: item,
    label: TabMap.get(item),
  })).filter((item) => {
    if (includesMagneticMachineTreatment.value) {
      return item;
    }
    // 沒有磁波拿掉磁波病例單
    return item.name !== 'magneticWaveRecord';
  });
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

const showError = ref(false);
const successRedirectUrl = `${window.location.origin}/sign-success`;
async function handleSign(contractType: ContractTypes) {
  Loading.show({ message: '等待合約完成...' });
  const payload = JSON.stringify(({
    contractType,
    clientId: appointmentStore.targetClientSchedule?.clientId,
    scheduleId: props.scheduleId,
  }));

  try {
    const { shareLink } = await getContractShareLink({
      redirectUrl: successRedirectUrl,
      payloadJSONString: payload,
      type: contractType,
    });

    Loading.hide();
    // show sign view in same page
    window.location.replace(shareLink);
  }
  catch (error) {
    Loading.hide();
    showError.value = true;
  }
}

const isMachineOnlyTreatment = computed(() => !!userShiftType.value && MachineShifts.includes(userShiftType.value));
const machineContract = computed(() => {
  if (!isMachineOnlyTreatment.value && !!appointmentStore.targetClientSchedule?.machines?.[0]?.type)
    return null;

  const machineType = appointmentStore.targetClientSchedule?.machines?.[0]?.type as MachineTypes;
  return MachineContractMapping[machineType];
});

function handleMachineSign() {
  if (!userShiftType.value || !isMachineOnlyTreatment.value || !machineContract.value)
    return;

  handleSign(machineContract.value.contractType);
}

const addOnCounts = computed(() => appointmentStore.targetClientSchedule?.addOnServices?.filter(service => service.isAddOn)?.length ?? 0);
</script>

<template>
  <QBtn label="返回" icon="chevron_left" color="primary" flat style="width: fit-content; margin: 4px 0; padding: 4px 8px; " @click="$router.push({ name: 'appointmentListCalendar' })" />
  <QTabs v-model="currentTab" align="left" dense>
    <QTab v-for="(tab, idx) in tabs" :key="idx" :name="tab.name" :label="tab.label" :disable="tab.name === 'addOnPrice' && isMachineOnlyTreatment">
      <QTooltip v-if="tab.name === 'addOnPrice' && isMachineOnlyTreatment" anchor="top middle" self="center middle" class="bg-black">
        儀器治療的預約單，不可再加購儀器服務
      </QTooltip>
      <QBadge v-else-if="tab.name === 'addOnPrice' && !!addOnCounts" rounded color="red" :label="addOnCounts" />
    </QTab>
  </QTabs>
  <QCard flat bordered class="info">
    <QTabPanels v-model="currentTab" animated>
      <QTabPanel v-for="(tab, idx) in tabs" :key="idx" :name="tab.name">
        <KeepAlive>
          <div class="full-height">
            <div v-if="appointmentStore.needToSignFirstVisit" class="first_contract_banner">
              <QBtn disable icon="warning" round unelevated color="orange-3" text-color="red-8" class="q-mr-sm" style="cursor: default;" />
              <p>需簽署「就診須知合約」才能進行後續治療服務</p>
              <QBtn label="簽約" unelevated rounded color="primary" class="q-ml-auto" @click="handleSign(ContractTypes['物理治療初診就診須知'])" />
            </div>
            <div v-if="isMachineOnlyTreatment && appointmentStore.needToSignMachineContract" class="first_contract_banner">
              <QBtn disable icon="warning" round unelevated color="orange-3" text-color="red-8" class="q-mr-sm" style="cursor: default;" />
              <p>需簽署「{{ machineContract?.name }}」才能進行後續治療服務</p>
              <QBtn v-if="!!machineContract && !!userShiftType" label="簽約" unelevated rounded color="primary" class="q-ml-auto" @click="handleMachineSign" />
            </div>
            <component :is="recordModules[tab.name]" :schedule-id="+scheduleId" :schedule-detail="appointmentStore.targetClientSchedule" />
          </div>
        </KeepAlive>
      </QTabPanel>
    </QTabPanels>
  </QCard>
  <GenericDialog
    v-model="showError"
    title="合約簽署失敗"
    confirm-label="我知道了"
    message="抱歉，執行過程中發生錯誤。請檢查您的網路連線或稍後再試一次。如果問題持續發生，請聯繫開發團隊。"
    @confirm="showError = false"
  />
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
:deep(.q-tab) {
  .q-tab__content {
    flex-direction: row !important;
    gap: 4px;
  }
}
</style>
