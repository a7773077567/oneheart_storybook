<script setup lang="ts">
import { computed, ref } from 'vue';
import { addOnService, deleteAddOnService, getContractShareLink, updateAddOnServices } from '@/api';
import type { ClientScheduleDetail, UpdateMachinePayload } from '@/api';
import { Loading, QBadge, QItemLabel, useQuasar } from 'quasar';
import { useAppointmentStore } from '@/stores';
import { AddOnServiceTypes, MachineTypes } from '@/const/general';
import type { FormContext } from 'vee-validate';
import EditMachineForm from './EditMachineForm.vue';
import { MachineContractMapping } from '@/const/contracts';
import { AppointmentState, PaymentState } from '@/const/appointment';
import { GenericDialog } from '@/components/shared';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const appointmentStore = useAppointmentStore();
const addOnServices = [
  { label: '震波儀器治療', machineType: MachineTypes['震波儀器治療'], serviceType: AddOnServiceTypes['震波'] },
  { label: '磁波儀器治療', machineType: MachineTypes['磁波儀器治療'], serviceType: AddOnServiceTypes['射頻'] },
  { label: '射頻儀器治療', machineType: MachineTypes['射頻儀器治療'], serviceType: AddOnServiceTypes['磁波'] },
];

const availableList = computed(
  () => addOnServices
    .map((service) => {
      const addedService = appointmentStore.targetAppointmentAddOns.find(a => a.type === service.machineType);

      return ({
        ...service,
        ...addedService,
        isAdded: !!addedService,
      });
    }).sort((a, b) => Number(a.isAdded) - Number(b.isAdded)),
);

// 發數要從 record 拿，不存在加購項目中
const shockWaveShots = computed(() => props.scheduleDetail.record?.addOnServiceShockWaveShots ?? 0);
const isCheckedOut = computed(() => props.scheduleDetail.paymentState === PaymentState['已結帳']);
const isServiceFinished = computed(() => props.scheduleDetail.state === AppointmentState['完成服務'] || props.scheduleDetail.state === AppointmentState['病例完成']);
const appointmentClientId = computed(() => props.scheduleDetail.clientId);

const $q = useQuasar();
async function addItem(item: typeof availableList.value[number]) {
  try {
    await addOnService({ clientScheduleId: props.scheduleId, serviceType: item.serviceType });
    $q.notify({ message: '加價服務添加成功', timeout: 200, position: 'top' });

    appointmentStore.getClientSchedule(props.scheduleId);
  }
  catch (error) {
    console.log(error);
  }
}

async function rmItem(item: typeof availableList.value[number]) {
  await deleteAddOnService({ clientScheduleId: props.scheduleId, serviceType: item.serviceType });
  $q.notify({ message: '加價服務移除成功', timeout: 200, position: 'top' });
  appointmentStore.getClientSchedule(props.scheduleId);
}

const isEditingMachine = ref(false);

type InitVal = InstanceType<typeof EditMachineForm>['$props']['initVal'] & { machineType: MachineTypes; serviceType: AddOnServiceTypes };
const serviceInitVal = ref<InitVal>({} as InitVal);

async function updateMachineInfo({ value, setFieldError }: { value: UpdateMachinePayload; setFieldError: FormContext['setFieldError'] }) {
  if (serviceInitVal.value === null)
    return;
  try {
    const { machineId, startTime, endTime } = value;
    await updateAddOnServices({
      clientScheduleId: props.scheduleId,
      addOnService: {
        machineId,
        startTime,
        endTime,
        serviceType: serviceInitVal.value.serviceType,
        // 如果是震波，發數必填
        ...(serviceInitVal.value.serviceType === AddOnServiceTypes['震波'] ? { addOnServiceShockWaveShots: value.shockWaveShots } : {}),
      },
    });
    appointmentStore.getClientSchedule(props.scheduleId);
    isEditingMachine.value = false;
  }
  catch (error) {
    setFieldError('period', '此時間已有其他預約占用此儀器，請選擇其他可用時段`');
    setFieldError('startTime', '此時間已有其他預約占用此儀器，請選擇其他可用時段`');
    setFieldError('endTime', '此時間已有其他預約占用此儀器，請選擇其他可用時段`');
  }
}

// 儀器合約
const showError = ref(false);
async function handleSign({ serviceType, machineType }: { serviceType: AddOnServiceTypes; machineType: MachineTypes }) {
  const contract = MachineContractMapping[machineType];

  Loading.show({ message: '等待合約完成...' });
  const payload = JSON.stringify(({
    contractType: contract.contractType,
    clientId: appointmentClientId.value,
    scheduleId: props.scheduleId,
    serviceType,
    isAddOn: true,
  }));

  try {
    const { shareLink } = await getContractShareLink({
      redirectUrl: `${window.location.origin}/sign-success`,
      payloadJSONString: payload,
      type: contract.contractType,
      clientId: appointmentClientId.value,
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
</script>

<template>
  <div class="add_on">
    <QList separator class="add_on_list">
      <QItem v-for="addOn in availableList" :key="addOn.serviceType">
        <QItemSection>
          <QItemLabel>
            {{ addOn.label }}
          </QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel v-if="!!addOn.contractStatus">已簽約</QItemLabel>
          <QBtn v-else label="簽約" rounded color="primary" style="width: fit-content" @click="handleSign(addOn)" />
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel>機台 {{ addOn.machine }}</QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel>時間 {{ addOn.startTime }} - {{ addOn.endTime }}</QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <div v-if="addOn.serviceType === AddOnServiceTypes['震波']" class="flex" style="width: max-content">
            <span>發數</span>
            <span v-if="!!shockWaveShots">{{ shockWaveShots }}</span>
            <QBadge v-else style="background-color: #F8C9CB; color:#C2351A" class="q-ml-sm q-px-sm q-py-xs text-weight-medium">
              發數未填寫
            </QBadge>
          </div>
        </QItemSection>
        <QItemSection side>
          <div v-if="addOn.isAdded" class="flex">
            <QBtn :disable="isCheckedOut || isServiceFinished" label="移除" icon="o_delete" flat color="primary" class="q-px-md" @click="rmItem(addOn)">
              <QTooltip v-if="isCheckedOut || isServiceFinished" class="bg-black" anchor="top middle" self="top middle">
                {{ isCheckedOut ? '此交易已結帳完成' : '此服務已完成' }}
              </QTooltip>
            </QBtn>
            <QBtn
              label="編輯" icon="o_edit" outline rounded color="primary" class="q-px-md"
              :disable="isCheckedOut || isServiceFinished"
              @click="(isEditingMachine = true), (serviceInitVal = {
                machineId: addOn.machineId!,
                startTime: addOn.startTime!,
                endTime: addOn.endTime!,
                scheduleStartTime: scheduleDetail.scheduleStartTime,
                scheduleEndTime: scheduleDetail.scheduleEndTime,
                machineType: addOn.machineType,
                serviceType: addOn.serviceType,
                ...(addOn.serviceType === AddOnServiceTypes['震波'] ? { shockWaveShots } : {}),
              }
              )"
            />
          </div>
          <QBtn
            v-else rounded icon="add" label="添加" :disable="isCheckedOut || isServiceFinished" color="primary" class="q-px-lg"
            @click="addItem(addOn)"
          >
            <QTooltip v-if="isCheckedOut || isServiceFinished" class="bg-black" anchor="top middle" self="top middle">
              {{ isCheckedOut ? '此交易已結帳完成' : '此服務已完成' }}
            </QTooltip>
          </QBtn>
        </QItemSection>
      </QItem>
    </QList>
    <QDialog v-model="isEditingMachine" persistent>
      <EditMachineForm
        title="編輯儀器治療" :init-val="serviceInitVal" :machine-type="serviceInitVal.machineType"
        @cancel="isEditingMachine = false" @submit="updateMachineInfo"
      />
    </QDialog>
  </div>
  <GenericDialog
    v-model="showError"
    title="合約簽署失敗"
    confirm-label="我知道了"
    message="抱歉，執行過程中發生錯誤。請檢查您的網路連線或稍後再試一次。如果問題持續發生，請聯繫開發團隊。"
    @confirm="showError = false"
  />
</template>

<style lang="scss" scoped>
.add_on {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &_list {
    border: 1px solid #0000001f;
    border-right: 0;
    border-left: 0;
  }
}
</style>
