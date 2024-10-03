<script setup lang="ts">
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass';
import { computed, ref } from 'vue';
import type { User } from '@/api/user';

interface Props {
  modelValue: string;
  modelResources: User[];
  initOptions?: number[];
  intervalStart?: number;
  intervalCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  intervalStart: 9,
  intervalCount: 9,
});
const emit = defineEmits<{
  'update:modelValue': [model: string];
  'update:modelResources': [model: any];
  requery: [];
}>();

const model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  },
});
const resources = computed({
  get: () => props.modelResources,
  set: val => emit('update:modelResources', val),
});

const calendar = ref<QCalendarResource | null>(null);
const options = computed(() => resources.value.map(({ id, name }) => ({
  label: name,
  value: id,
})));
const selected = ref(props.initOptions ?? options.value.map(option => option.value));
const selectedResources = computed(() => {
  return resources.value.filter(item => selected.value.includes(item.id));
});

function getCalendarStyle() {
  return {
    '--calendar-border': '1px solid #B2B2B2',
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
      <div class="column items-center q-gutter-md">
        <DatePicker v-model="model" />
        <CalendarNav
          @prev="calendar?.prev"
          @today="calendar?.moveToToday"
          @next="calendar?.next"
        />
      </div>
      <slot name="nav-right">
        <div class="pad" style="width: 164px;" />
      </slot>
    </div>
    <div class="calendar__body">
      <QCalendarResource
        ref="calendar"
        v-model="model"
        v-model:model-resources="selectedResources"
        resource-key="id"
        resource-label="name"
        :interval-start="intervalStart"
        :interval-count="intervalCount"
        :cell-width="125"
        animated
        bordered
        :style="getCalendarStyle()"
        style="height: 100%; max-height: fit-content"
      >
        <template #head-resources>
          <div class="row flex-center full-width">
            <span class="text-weight-bold">人員</span>
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
        <template #resource-intervals="{ scope }">
          <slot name="intervals" :scope="scope" />
        </template>
      </QCalendarResource>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  // max-width: 1225px;
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
:deep(.q-calendar-resource__head--interval) {
  font-size: 14px;
  font-weight: 500;
}
:deep(.q-calendar-resource__resource--interval) {
  min-height: 135px !important;
}

// :deep(.q-calendar-resource__resource--row:last-child) {
//   border-bottom: 1px solid #b2b2b2;
// }
</style>
