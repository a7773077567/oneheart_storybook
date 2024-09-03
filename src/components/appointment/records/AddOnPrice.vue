<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ClientScheduleDetail } from '@/api';
import { useQuasar } from 'quasar';

defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
  readonly: boolean;
}>();

const addOnList = ref([
  { label: '儀器治療', value: 1, isAdded: true },
  { label: '加時', value: 2, isAdded: false },
]);
const addOnItems = computed(() => addOnList.value.filter(item => item.isAdded));

const $q = useQuasar();
function addItem(item: typeof addOnList.value[number]) {
  item.isAdded = true;
  // fetch api
  console.log(addOnItems.value);
  $q.notify({ message: '加價服務添加成功', timeout: 200, position: 'top' });
}

function rmItem(item: typeof addOnList.value[number]) {
  item.isAdded = false;
  // fetch api
  console.log(addOnItems.value);
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
          <QBtn v-else label="添加" color="black" class="q-px-lg" @click="addItem(addOn)" />
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
