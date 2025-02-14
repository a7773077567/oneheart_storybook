<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';
import { HighConversionOpportunity } from '@/components/appointment/index';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { PaymentState, SchedulePaymentMap, ScheduleStateMap } from '@/const/appointment';
import { ShiftType, Types } from '@/const/general';

interface Props {
  data: ClientSchedule;
}
const props = defineProps<Props>();
const isCheckedOut = computed(() => props.data.paymentState === PaymentState['已結帳']);
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
const specialOffers = computed(() => [
  { label: '員工價', value: props.data.isEmployeePrice },
  { label: '自動推薦', value: props.data.isUsingAutoRecommend },
]);
const tooltipInfo = [
  { label: null, value: `${props.data.scheduleStartTime} - ${props.data.scheduleEndTime}` },
  ...(props.data.isFirstClientSchedule ? [{ label: null, value: '初診' }] : []),
  {
    label: '姓名',
    value: props.data.client.name,
  },
  {
    label: '科別',
    value: typeLabel.value,
  },
  ...(props.data.note
    ? [{
        label: '預約備註',
        value: props.data.note,
      }]
    : []),
  ...(props.data.userShift.type === ShiftType['G動椅'] ? [{ label: '治療師', value: props.data.userShift.user?.id ? props.data.userShift.user?.name : '未指派' }] : []),
];
</script>

<template>
  <div class="booking-card" :class="{ 'booking-card--first': data.isFirstClientSchedule }">
    <div class="booking-card__client">
      <div class="booking-card__client--val q-pr-sm">客戶：{{ data.client.name }}</div>
      <p class="booking-card__client--val">科別：{{ typeLabel }}</p>
      <p v-if="data.userShift.type === ShiftType['G動椅']" class="booking-card__client--val">治療師：{{ data.userShift.user.name || '未指派' }}</p>
    </div>

    <div v-if="data.isFirstClientSchedule" class="booking-card__badge">初</div>

    <div class="flex q-gutter-xs">
      <template v-for="(offer, idx) in specialOffers" :key="idx">
        <QBadge v-if="!!offer.value" color="green-3" text-color="green-8" class="text-weight-bold">{{ offer.label }}</QBadge>
      </template>
      <HighConversionOpportunity v-if="data.isHighSalesOpportunity" mini-mode />
    </div>

    <p class="booking-card__state">{{ stateLabel }}</p>

    <QBtn :label="isCheckedOut ? '＄已結帳' : '＄結帳' " :disable="isCheckedOut || beforeCheckIn" rounded color="white" text-color="black" unelevated dense size="12px" padding="3px 12px" @click.stop="() => router.push({ name: 'appointmentListCheckout', params: { scheduleId: data.id } })" />

    <QTooltip :key="data.id" class="bg-black text-white booking-card__note q-pa-md" anchor="center right" self="bottom middle" max-width="264px" max-height="160px">
      <div v-for="(item, idx) in tooltipInfo" :key="idx" class="tooltip_info">
        <div v-if="!!item.label" class="label">{{ item.label }}：</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </QTooltip>
  </div>
</template>

<style lang="scss" scoped>
@mixin overflow {
  overflow: scroll;
  white-space: nowrap;
}

.booking-card {
  // max-width: 105px;
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
  font-size: 14px !important;
  overflow: hidden;
  .note {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .tooltip_info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
