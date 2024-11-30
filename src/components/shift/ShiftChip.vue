<script setup lang="ts">
import { computed } from 'vue';
import type { UserShift } from '@/api/shift';
import { getWeekDay } from '@/utils/date';
import dayjs from 'dayjs';
import { ShiftType } from '@/const/general';

interface Props {
  data: UserShift;
  editMode?: boolean;
  hideEdit?: boolean;
  isGroupClass?: boolean;
}
const props = defineProps<Props>();
defineEmits<{
  update: [shiftId: number];
  delete: [shiftId: number];
}>();

const date = computed(() => {
  const date = dayjs(props.data.date);
  const week = getWeekDay(date.get('day'));
  return `${date.format('MM月DD')}${week}`;
});

const duration = computed(() => toDurationLabel(props.data.startTime, props.data.endTime));
const type = computed(() => ShiftType[props.data.type] as keyof typeof ShiftType);
const unavailable = computed(() => props.data.notAvailableTimes.map(item => toDurationLabel(item.startTime, item.endTime, true)));
const bgc = computed(() => props.data.color);

function toDurationLabel(startTime: string, endTime: string, isUnavailable?: boolean) {
  const label = `${startTime}-${endTime}`;
  return isUnavailable
    ? `${label}不可預約`
    : label;
}

const reachMaxGroupClassCounts = computed(() => (props.data.groupClass?.scheduleClasses ?? 0) >= (props.data.groupClass?.numberOfClasses ?? 0));
</script>

<template>
  <div :class="[isGroupClass ? 'shift-chip--group-class' : 'shift-chip']">
    <div class="shift-chip__item">
      {{ duration }}
    </div>
    <div class="shift-chip__item">
      {{ data.name }}
    </div>
    <div v-if="type === '團課'" class="shift-chip__item">
      <QChip size="xs" :color="reachMaxGroupClassCounts ? 'black' : 'red'" text-color="white">
        {{ data.groupClass?.scheduleClasses }}/{{ data.groupClass?.numberOfClasses }}
      </QChip>
    </div>
    <QPopupProxy anchor="top right">
      <QCard style="padding: 10px 0 20px 0">
        <QCardActions align="right" style="padding: 0 10px 10px;">
          <QIcon v-close-popup name="close" size="24px" class="cursor-pointer" />
        </QCardActions>
        <QCardSection class="column q-gutter-xs text-body1 q-mb-xs" style="padding: 0 30px;">
          <div>{{ data.name }}</div>
          <div>{{ date }}</div>
          <div>{{ duration }}</div>
          <div>{{ type }}</div>
          <div
            v-for="(item, idx) in unavailable"
            :key="idx"
          >
            {{ item }}
          </div>
          <div v-if="type === '團課'" class="text-no-wrap">為團體課程，已排定 {{ data.groupClass?.scheduleClasses }} 堂 / 共需 {{ data.groupClass?.numberOfClasses }} 堂</div>
        </QCardSection>
        <QCardActions v-if="editMode" style="padding: 0 30px;">
          <QBtn icon="o_delete" flat round dense @click="$emit('delete', data.id)" />
          <QBtn v-if="!hideEdit" icon="o_edit" flat round dense @click="$emit('update', data.id)" />
        </QCardActions>
      </QCard>
    </QPopupProxy>
  </div>
</template>

<style lang="scss" scoped>
.shift-chip {
  width: 90px;
  min-height: 40px;
  padding: 3px;
  border-radius: 5px;
  background-color: v-bind('bgc');
  cursor: pointer;
  &--group-class {
    @extend .shift-chip;
    background-color: #f2c172;
  }
  &__item {
    text-align: center;
    color: black;
    font-size: 12px;
    font-weight: 500;
  }
  :deep(.q-chip__content) {
    font-weight: 500;
    font-size: 11px;
  }
}
</style>
