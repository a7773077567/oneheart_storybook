<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';
import { HighConversionOpportunity } from '@/components/appointment/index';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { AppointmentState, PaymentState, SchedulePaymentMap, ScheduleStateMap } from '@/const/appointment';
import { ShiftType, Types } from '@/const/general';
import AddOnIcon from './AddOnIcon.vue';

interface Props {
  data: ClientSchedule;
}
const props = defineProps<Props>();
const isCheckedOut = computed(() => props.data.paymentState === PaymentState['已結帳']);
const beforeCheckIn = computed(() => props.data.state === AppointmentState['預約']);

const router = useRouter();
const stateInfo = computed(() => ScheduleStateMap.get(props.data.state)!);

const isGroupClass = computed(() => props.data.userShift.type === 11);
const type = computed(() => Object.values(Types).find(type => props.data.userShift.type === type.identifier));
const typeLabel = computed(() => isGroupClass.value ? props.data.userShift.name : type.value?.label);
const specialOffers = computed(() => [
  { label: '員工價', value: props.data.isEmployeePrice },
  { label: '自動推薦', value: props.data.isUsingAutoRecommend },
]);
const tooltipInfo = computed(() => [
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
]);

const addOns = computed(() => props.data.addOnServices.filter(a => a.isAddOn));
</script>

<template>
  <QCard flat class="booking-card bg-secondary-container" :class="{ 'booking-card--first': data.isFirstClientSchedule }">
    <div v-if="data.isFirstClientSchedule" class="booking-card__badge">初</div>
    <QCardSection class="q-pa-none q-mb-xs text-on-surface">
      <p class="text-label-medium-prominent q-mb-xs">{{ `${data.scheduleStartTime} - ${data.scheduleEndTime}` }}</p>
      <p>
        <span class="text-label-large-perminent q-mr-sm">{{ data.client.name }}</span> <span class="text-label-medium-prominent">{{ typeLabel }}</span>
      </p>
    </QCardSection>
    <QCardSection v-if="data.userShift.type === ShiftType['G動椅']" class="q-pa-none q-mb-xs">
      <p class="">治療師：{{ data.userShift.user.name || '未指派' }}</p>
    </QCardSection>
    <QCardSection v-if="addOns?.length > 0" class="q-pa-none q-mb-xs">
      <div class="row items-center q-gutter-x-xs">
        <span class="text-label-medium">加購：</span>
        <AddOnIcon v-for="addOn in addOns" :key="addOn.type" :machine-type="addOn.type" />
      </div>
    </QCardSection>
    <QCardSection class="q-pa-none">
      <div class="flex q-gutter-x-xs">
        <QBadge class="text-label-small" v-bind="+props.data.state < 3 ? { color: 'error-16', textColor: 'error' } : { color: 'secondary-16', textColor: 'on-surface-variant' }">{{ stateInfo.label }}</QBadge>
        <HighConversionOpportunity v-if="data.isHighSalesOpportunity" mini-mode />
        <template v-for="(offer, idx) in specialOffers" :key="idx">
          <QBadge v-if="!!offer.value" class="text-weight-bold bg-forest-16 text-forest">{{ offer.label }}</QBadge>
        </template>
      </div>
    </QCardSection>
    <QCardActions align="right" class="q-pb-none">
      <div v-if="isCheckedOut" class="text-label-large text-outline">＄已結帳</div>
      <QBtn v-else label="＄結帳" :disable="isCheckedOut || beforeCheckIn" rounded color="primary" text-color="white" unelevated dense size="12px" padding="3px 12px" @click.stop="() => router.push({ name: 'appointmentListCheckout', params: { scheduleId: data.id } })" />
    </QCardActions>

    <QTooltip :id="`tooltip-${data.id}`" :key="data.id" class="bg-black text-white booking-card__note q-pa-md" anchor="center right" self="bottom middle" max-width="264px" max-height="160px">
      <div v-for="(item, idx) in tooltipInfo" :key="idx" class="tooltip_info">
        <div v-if="!!item.label" class="label">{{ item.label }}：</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </QTooltip>
  </QCard>
</template>

<style lang="scss" scoped>
@mixin overflow {
  overflow: scroll;
  white-space: nowrap;
}

.booking-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  font-size: 12px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  justify-content: center;
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
  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: $tertiary;
    border-radius: 0 8px;
    padding: 2px 4px;
    @include text-style($label-medium, $on-primary);
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
