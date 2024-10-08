<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { SchedulePaymentMap, ScheduleStateMap } from '@/const/appointment';
import { Types } from '@/const/general';

interface Props {
  data: ClientSchedule;
}
const props = defineProps<Props>();
const isCheckedOut = computed(() => props.data.paymentState === 2);
const beforeCheckIn = computed(() => props.data.state === 1);

const router = useRouter();
const paymentInfo = computed(() => SchedulePaymentMap.get(props.data.paymentState)!);
const stateInfo = computed(() => ScheduleStateMap.get(props.data.state)!);
const cardBgc = computed(() => paymentInfo.value.cardStyle.bgc);
const stateLabel = computed(() => stateInfo.value.label);
const stateColor = computed(() => stateInfo.value.cardStyle?.color);
const isGroupClass = computed(() => props.data.userShift.type === 11);
const type = computed(() => Object.values(Types).find(type => props.data.userShift.type === type.identifier));
const typeLabel = computed(() => isGroupClass.value ? props.data.userShift.name : type.value?.label);
</script>

<template>
  <div class="booking-card" :class="{ 'booking-card--first': data.isFirstClientSchedule }">
    <div class="booking-card__client">
      <div class="booking-card__client--val q-pr-sm">客戶：{{ data.client.name }}</div>
      <p class="booking-card__client--val">科別：{{ typeLabel }}</p>
    </div>
    <div v-if="data.isFirstClientSchedule" class="booking-card__badge">初</div>
    <p class="booking-card__state">{{ stateLabel }}</p>
    <QBtn :label="isCheckedOut ? '＄已結帳' : '＄結帳' " :disable="isCheckedOut || beforeCheckIn" rounded color="white" text-color="black" unelevated dense size="12px" padding="3px 12px" @click.stop="() => router.push({ name: 'appointmentListCheckout', params: { scheduleId: data.id } })" />

    <QTooltip class="bg-black text-white booking-card__note q-pa-md" anchor="center right" self="bottom middle" max-width="264px" max-height="160px">
      <p class="q-mb-xs text-bold">{{ `${data.scheduleStartTime}-${data.scheduleEndTime}` }}</p>
      <div>
        <p class="q-mb-xs">客戶：{{ data.client.name }}</p>
        <span v-if="data.isFirstClientSchedule">初診</span>
      </div>
      <p class="q-mb-xs">科別：{{ typeLabel }}</p>
      <p class="note">{{ data.note ?? '-' }}</p>
    </QTooltip>
  </div>
</template>

<style lang="scss" scoped>
@mixin overflow {
  overflow: scroll;
  white-space: nowrap;
}

.booking-card {
  max-width: 105px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  font-size: 12px;
  background-color: v-bind('cardBgc');
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  &__client {
    @include overflow;
    &--val {
      white-space: pre-wrap;
      text-wrap: wrap;
      word-break: break-all;
    }
  }
  &__type {
    @include overflow;
  }
  &__state {
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    color: v-bind('stateColor');
    background-color: #515050;
  }
  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    content: '';
    background: #515050;
    color: white;
    border-radius: 0 0 0 50%;
    padding: 2px 4px;
    font-weight: 600;
  }
}

*::-webkit-scrollbar {
  display: none;
}
</style>

<style lang="scss">
.q-tooltip {
  font-size: 16px !important;
  overflow: hidden;
  .note {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
