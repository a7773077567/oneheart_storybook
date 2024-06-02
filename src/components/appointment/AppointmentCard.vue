<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';
import { getType } from '@/utils/mappers';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { SchedulePaymentMap, ScheduleStateMap } from '@/const/appointment';

interface Props {
  data: ClientSchedule;
}
const props = defineProps<Props>();

// interface State {
//   identifier: number;
//   name: string;
//   label: string;
//   color: string;
// }
// const States: State[] = [
//   {
//     identifier: 1,
//     name: 'appointment',
//     label: '預約',
//     color: '#FFFFFF',
//   },
//   {
//     identifier: 2,
//     name: 'checkIn',
//     label: '報到',
//     color: '#88F2D8',
//   },
//   {
//     identifier: 3,
//     name: 'serviceDone',
//     label: '完成服務',
//     color: '#E86969',
//   },
//   {
//     identifier: 4,
//     name: 'recordDone',
//     label: '病例完成',
//     color: '#FFFFFF',

//   },
// ];

const router = useRouter();
const paymentInfo = computed(() => SchedulePaymentMap.get(props.data.paymentState)!);
const stateInfo = computed(() => ScheduleStateMap.get(props.data.state)!);
const cardBgc = computed(() => paymentInfo.value.cardStyle.bgc);
const stateLabel = computed(() => stateInfo.value.label);
const stateColor = computed(() => stateInfo.value.cardStyle?.color);
const type = computed(() => getType(props.data.userShift.type));
</script>

<template>
  <div class="booking-card">
    <div class="booking-card__client">
      客戶：{{ data.client.name }}
    </div>
    <p class="booking-card__type">
      科別：{{ type }}
    </p>
    <p class="booking-card__state">
      {{ stateLabel }}
    </p>
    <QBtn label="＄結帳" rounded color="white" text-color="black" unelevated dense size="12px" padding="3px 12px" @click.stop="() => router.push({ name: 'appointmentListCheckout', params: { scheduleId: data.id } })" />
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
  &__client {
    @include overflow;
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
}

*::-webkit-scrollbar {
  display: none;
}
</style>
