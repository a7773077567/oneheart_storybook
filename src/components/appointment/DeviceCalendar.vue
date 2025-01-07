<script setup lang='ts'>
import { QCalendarResource, today } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass';
import { ref } from 'vue';

const calendar = ref<QCalendarResource | null>(null);
const selectedDate = ref(today());
const resources = ref([
  { id: '1', name: 'John' },
  { id: '2', name: 'Board Room' },
  { id: '3', name: 'Mary' },
  { id: '4', name: 'Susan' },
  { id: '5', name: 'Olivia' },
]);
</script>

<template>
  <div class="device_calendar">
    <QCalendarResource
      ref="calendar"
      v-model="selectedDate"
      v-model:model-resources="resources"
      resource-key="id"
      resource-label="name"
      :interval-start="16"
      :interval-count="30"
      :interval-minutes="30"
      :cell-width="125"
      animated
      bordered
      style="height: 100%; max-height: fit-content"
    >
      <!-- :style="getCalendarStyle()" -->
      <template #head-resources>
        <div class="row flex-center full-width">
          <span class="text-weight-bold">人員</span>
        </div>
      </template>
      <template #resource-label="{ scope }">
        <slot name="resource-label" :scope="scope">
          <div class="col-12">
            <QChip>
              <QAvatar v-if="scope.resource.avatar">
                <img :src="scope.resource.avatar">
              </QAvatar>
              {{ scope.resource.name }}
            </QChip>
          </div>
        </slot>
      </template>
      <template #resource-intervals="{ scope }">
        <slot name="intervals" :scope="scope" />
      </template>
    </QCalendarResource>
  </div>
</template>

<style scoped lang="scss">
.device_calendar {
  height: 100%;
}
</style>
