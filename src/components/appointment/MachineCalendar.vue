<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { QCalendarResource, nextDay, today } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass';

interface Props {
  modelValue: string;
  modelResources: { id: number; name: string }[];
  initOptions?: number[];
  intervalStart?: number;
  intervalCount?: number;
  intervalMinutes?: number;
  resourceWidth?: number;
  cellWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  intervalStart: 9,
  intervalCount: 9,
  intervalMinutes: 30,
  resourceWidth: 200,
  cellWidth: 125,
});

const emit = defineEmits<{
  (e: 'update:modelResources', val: typeof props.modelResources): void;
  (e: 'update:modelValue', val: typeof props.modelValue): void;
}>();

const calendar = ref<QCalendarResource | null>(null);
const selectedDate = computed({
  get: () => props.modelValue ?? today(),
  set(updatedVal) {
    emit('update:modelValue', updatedVal);
  },
});

const resources = computed({
  get: () => props.modelResources,
  set(updatedR) {
    emit('update:modelResources', updatedR);
  },
});

function getCalendarStyle() {
  return {
    'height': '100%',
    'max-height': 'fit-content',
    '--calendar-border': '1px solid #B2B2B2',
    ...(props.resourceWidth && { '--calendar-resources-width': `${props.resourceWidth}px` }),
  };
}
</script>

<template>
  <div class="device_calendar">
    <div v-if="'nav' in $slots">
      <slot name="nav" v-bind="{ calendar }" />
    </div>
    <QCalendarResource
      ref="calendar"
      v-model="selectedDate"
      v-model:model-resources="resources"
      resource-key="id"
      resource-label="name"
      :interval-start="intervalStart"
      :interval-count="intervalCount"
      :interval-minutes="intervalMinutes"
      :resource-width="resourceWidth"
      :cell-width="cellWidth"
      animated
      bordered
      :style="getCalendarStyle()"
    >
      <template #head-resources>
        <div class="row flex-center full-width">
          <span class="text-weight-bold">儀器</span>
        </div>
      </template>
      <template #resource-label="{ scope }">
        <slot name="resource-label" :scope="scope">
          <div class="col-12 resource">
            <div class="resource_name">{{ scope.resource.name }}</div>
            <span>儀器治療</span>
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
  .resource {
    padding: 4px 10px;
    align-self: start;
    color: #1a1b21;
    &_name {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }
  }
  :deep(.q-calendar-resource__head--interval) {
    font-size: 14px;
    font-weight: 500;
  }
  :deep(.q-calendar-resource__resource--interval) {
    min-height: 135px !important;
  }
}
</style>
