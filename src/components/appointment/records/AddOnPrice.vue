<script setup lang="ts">
import { computed, ref } from 'vue';
import { type ClientScheduleDetail, updateAddOnServices } from '@/api';
import { useQuasar } from 'quasar';
import { useAppointmentStore } from '@/stores';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const appointmentStore = useAppointmentStore();
const addOnList = ref(
  props.scheduleDetail.addOnServices.map((addOn, idx) => ({ label: addOn.serviceName, value: idx + 1, isAdded: addOn.isAddOn })),
);
const addOnResult = computed(() => addOnList.value.map(item => ({ serviceName: item.label, isAddOn: item.isAdded })));

const $q = useQuasar();
async function addItem(item: typeof addOnList.value[number]) {
  item.isAdded = true;
  await updateAddOnServices(props.scheduleId, addOnResult.value);
  $q.notify({ message: '加價服務添加成功', timeout: 200, position: 'top' });
}

async function rmItem(item: typeof addOnList.value[number]) {
  await updateAddOnServices(props.scheduleId, addOnResult.value);
  item.isAdded = false;
  $q.notify({ message: '加價服務移除成功', timeout: 200, position: 'top' });
}
</script>

<template>
  <div class="add_on">
    <h3 class="q-mb-md">加價服務管理</h3>
    <QList separator class="add_on_list">
      <QItem v-for="addOn in addOnList" :key="addOn.value" v-ripple>
        <QItemSection>
          <div class="row items-center">
            <span class="col-6">
              {{ addOn.label }}
            </span>
            <div v-if="addOn.isAdded" class="col-6 flex">
              <QIcon name="check_circle" class="q-mr-xs" size="20px" />
              <span>已添加</span>
            </div>
          </div>
        </QItemSection>
        <QItemSection side>
          <QBtn v-if="addOn.isAdded" label="移除" icon="o_delete" outline class="q-px-lg" @click="rmItem(addOn)" />
          <QBtn v-else label="添加" :disable="!appointmentStore.isSameSpaceClinicSchedule" color="black" class="q-px-lg" @click="addItem(addOn)" />
        </QItemSection>
      </QItem>
    </QList>
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
