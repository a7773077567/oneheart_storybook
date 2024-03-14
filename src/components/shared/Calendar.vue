<script setup lang="ts">
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass';
import { computed, ref } from 'vue';
import { getWeekDay } from '@/utils/date';
import type { Employee } from '@/api/shift';

interface Props {
  modelValue: string;
  modelResources: Employee[];
  simpleMode?: boolean;
  view: string;
  maxDays?: number | string;
  cellWidth?: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: string];
  'update:modelResources': [model: any];
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
const selected = ref(options.value.map(option => option.value));
const selectedResources = computed(() => {
  return resources.value.filter(item => selected.value.includes(item.id));
});
const isEditing = ref(false);
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
        :label="isEditing ? '取消編輯' : '編輯'"
        outline
        style="width: 113px;"
        @click="isEditing = !isEditing"
      />
      <slot v-else name="nav-right" />
    </div>
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
      animated
      bordered
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
            <QAvatar>
              <img
                v-if="resource.avatar"
                :src="resource.avatar"
              >
              <QIcon
                v-if="resource.icon"
                :name="resource.icon"
              />
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
</template>

<style lang="scss" scoped>
.calendar {
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
}

:deep(.q-field__native > span) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
