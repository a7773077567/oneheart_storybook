<script setup lang="ts">
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass';
import { computed, ref } from 'vue';
import { getWeekDay } from '@/utils/date';
import type { User } from '@/api/user';

export interface ChangeParams {
  start: string;
  end: string;
  days: Record<string, any>[];
}

interface Props {
  modelValue: string;
  modelResources: User[];
  simpleMode?: boolean;
  view: string;
  maxDays?: number | string;
  cellWidth?: string;
  resourceWidth?: number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: string];
  'update:modelResources': [model: any];
  'change': [calendarDuration: ChangeParams];
}>();
const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
const resources = computed({
  get: () => props.modelResources,
  set: val => emit('update:modelResources', val),
});

const calendar = ref<QCalendarScheduler | null>(null);
const options = computed(() => resources.value.map(({ id, name }) => ({
  label: name,
  value: id,
})));
const selected = ref<number[]>([]);
const selectedResources = computed(() => {
  return resources.value.filter(resource => selected.value.includes(resource.id));
});
const isEditing = ref(false);

function onChange(calendarDuration: ChangeParams) {
  emit('change', calendarDuration);
}

function getCalendarStyle() {
  return {
    '--calendar-border': '1px solid #B2B2B2',
    ...(props.resourceWidth && { '--calendar-resources-width': `${props.resourceWidth}px` }),
  };
}
</script>

<template>
  <div class="calendar">
    <div class="calendar__nav">
      <OSelect
        v-model="selected"
        name="employee"
        :options="options"
        multiple
        emit-value
        map-options
        dense
        outlined
        hide-bottom-space
        style="width: 164px;"
      />
      <div v-if="!simpleMode" class="column items-center q-gutter-md">
        <DatePicker v-model="model" />
        <CalendarNav
          @prev="calendar?.prev"
          @today="calendar?.moveToToday"
          @next="calendar?.next"
        />
      </div>

      <QBtn
        v-if="!simpleMode"
        :label="isEditing ? '完成編輯' : '編輯'"
        outline
        style="width: 113px;"
        @click="isEditing = !isEditing"
      />
      <slot v-else name="nav-right" />
    </div>
    <div class="calendar__body">
      <QCalendarScheduler
        ref="calendar"
        v-model="model"
        v-model:model-resources="selectedResources"
        :view="view"
        :max-days="maxDays"
        :cell-width="cellWidth"
        resource-key="id"
        resource-label="name"
        :resource-height="105"
        :resource-width="resourceWidth"
        animated
        bordered
        :style="getCalendarStyle()"
        style="height: 100%; max-height: fit-content;"
        @change="onChange"
      >
        <template #head-resources>
          <div class="row flex-center full-width">
            <span class="text-weight-bold">人員</span>
          </div>
        </template>
        <template #head-day="{ scope: { timestamp } }">
          <div class="row flex-center ">
            <span class="text-weight-bold">{{ timestamp.day }}</span>
            <span class="text-weight-bold">{{ getWeekDay(timestamp.weekday) }}</span>
          </div>
        </template>
        <template #resource-label="{ scope: { resource } }">
          <div class="col-12">
            <QChip>
              <QAvatar v-if="resource.avatar">
                <img
                  :src="resource.avatar"
                >
              </QAvatar>
              {{ resource.name }}
            </QChip>
          </div>
        </template>
        <template #day="{ scope }">
          <slot name="day" :scope="{ ...scope, isEditing }" />
        </template>
      </QCalendarScheduler>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
  &__body {
    height: calc(100vh - 264px);
  }
}

:deep(.q-field__native > span) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
