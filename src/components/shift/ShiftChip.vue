<script setup lang="ts">
import { computed } from 'vue';
import type { UserShift } from '@/api/shift';
import { getWeekDay } from '@/utils/date';
import dayjs from 'dayjs';
import { TherapyTypes } from '@/const/general';

interface Props {
  data: UserShift;
  editMode?: boolean;
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
const type = computed(() => [...Object.values(TherapyTypes)][props.data.type]);
const unavailable = computed(() => props.data.notAvailableTimes.map(item => toDurationLabel(item.startTime, item.endTime, true)));
const bgc = computed(() => props.data.color);

function toDurationLabel(startTime: string, endTime: string, isUnavailable?: boolean) {
  const label = `${startTime}:${endTime}`;
  return isUnavailable
    ? `${label}不可預約`
    : label;
}
</script>

<template>
  <div class="shift-chip">
    <div class="shift-chip__item">
      {{ duration }}
    </div>
    <div class="shift-chip__item">
      {{ data.name }}
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
        </QCardSection>
        <QCardActions v-if="editMode" style="padding: 0 30px;">
          <QBtn icon="o_delete" flat round dense @click="$emit('delete', data.id)" />
          <QBtn icon="o_edit" flat round dense @click="$emit('update', data.id)" />
        </QCardActions>
      </QCard>
    </QPopupProxy>
  </div>
</template>

<style lang="scss" scoped>
.shift-chip {
  width: 90px;
  height: 40px;
  padding: 3px;
  border-radius: 5px;
  background-color: v-bind('bgc');
  cursor: pointer;
  &__item {
    text-align: center;
    color: black;
    font-size: 12px;
  }
}
</style>
