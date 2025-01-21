<script setup lang="ts">
import { computed, ref } from 'vue';
import { addOnService, deleteAddOnService, updateAddOnServices } from '@/api';
import type { AddOnService, ClientScheduleDetail, UpdateMachinePayload } from '@/api';
import { QItemLabel, useQuasar } from 'quasar';
import { useAppointmentStore } from '@/stores';
import { AddOnServiceTypes, MachineTypes } from '@/const/general';
import type { FormContext } from 'vee-validate';
import EditMachineForm from './EditMachineForm.vue';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const appointmentStore = useAppointmentStore();
const addOnList = computed(
  () => props.scheduleDetail.addOnServices.map(service => ({
    ...service,
    label: service.serviceName,
    value: service.serviceType,
    isAdded: service.isAddOn,
  })),
);

const $q = useQuasar();
async function addItem(item: typeof addOnList.value[number]) {
  await addOnService({ clientScheduleId: props.scheduleId, serviceType: item.serviceType });
  $q.notify({ message: '加價服務添加成功', timeout: 200, position: 'top' });
  appointmentStore.getClientSchedule(props.scheduleId);
}

async function rmItem(item: typeof addOnList.value[number]) {
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

// to refactor
function getMachineType(serviceType: AddOnServiceTypes): MachineTypes {
  switch (serviceType) {
    case AddOnServiceTypes['射頻']:
      return MachineTypes['射頻儀器治療'];
    case AddOnServiceTypes['磁波']:
      return MachineTypes['磁波儀器治療'];
    case AddOnServiceTypes['震波']:
      return MachineTypes['震波儀器治療'];
  }
}
</script>

<template>
  <div class="add_on">
    <h3 class="q-mb-md">加價服務管理</h3>
    <QList separator class="add_on_list">
      <QItem v-for="addOn in addOnList" :key="addOn.value">
        <QItemSection>
          <QItemLabel>
            {{ addOn.label }}
          </QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel v-if="!!addOn.contractTaskId">已簽約</QItemLabel>
          <QBtn v-else label="簽約" rounded color="primary" style="width: fit-content" />
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel>機台 {{ addOn.machine }}</QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <QItemLabel>時間 {{ addOn.machine }}</QItemLabel>
        </QItemSection>
        <QItemSection v-if="addOn.isAdded">
          <div v-if="addOn.serviceType === AddOnServiceTypes['震波']" class="flex" style="width: max-content">
            <span>發數</span>
            <QBadge style="background-color: #F8C9CB; color:#C2351A" class="q-ml-sm q-px-sm q-py-xs text-weight-medium">
              發數未填寫
            </QBadge>
          </div>
        </QItemSection>
        <QItemSection side>
          <div v-if="addOn.isAdded" class="flex">
            <QBtn label="移除" icon="o_delete" flat color="primary" class="q-px-md" @click="rmItem(addOn)" />
            <QBtn
              label="編輯" icon="o_edit" outline rounded color="primary" class="q-px-md"
              @click="(isEditingMachine = true), (serviceInitVal = {
                machineId: addOn.machineId!,
                startTime: addOn.startTime,
                endTime: addOn.endTime,
                machineType: getMachineType(addOn.serviceType),
                serviceType: addOn.serviceType,
                shockWaveShots: addOn?.shockWaveShots,
              }
              )"
            />
          </div>
          <QBtn
            v-else label="添加" :disable="!appointmentStore.isSameSpaceClinicSchedule" color="black" class="q-px-lg"
            @click="addItem(addOn)"
          />
        </QItemSection>
      </QItem>
    </QList>
    <QDialog v-model="isEditingMachine">
      <EditMachineForm
        title="編輯儀器治療" :init-val="serviceInitVal" :machine-type="serviceInitVal.machineType"
        @cancel="isEditingMachine = false" @submit="updateMachineInfo"
      />
    </QDialog>
  </div>
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
