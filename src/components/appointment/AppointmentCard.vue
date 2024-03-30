<script setup lang="ts">
import type { ClientSchedule } from '@/api/appointment';
import { computed } from 'vue';

interface Props {
  data: ClientSchedule;
}
const props = defineProps<Props>();

interface State {
  identifier: number;
  name: string;
  label: string;
  color: string;
}
const States: State[] = [
  {
    identifier: 1,
    name: 'appointment',
    label: '預約',
    color: '#FFFFFF',
  },
  {
    identifier: 2,
    name: 'checkIn',
    label: '報到',
    color: '#88F2D8',
  },
  {
    identifier: 3,
    name: 'serviceDone',
    label: '完成服務',
    color: '#E86969',
  },
  {
    identifier: 4,
    name: 'recordDone',
    label: '病例完成',
    color: '#FFFFFF',

  },
];

const bgc = computed(() => props.data.paymentState === 1 ? '#F8C9CB' : '#A5D6F1');
const stateColor = computed(() => States[props.data.state + 1].color);
</script>

<template>
  <div class="booking-card">
    <div class="booking-card__client">
      客戶：{{ data.client.name }}
    </div>
    <p class="booking-card__type">
      科別：{{ data.userShift.name }}
    </p>
    <p class="booking-card__state">
      {{ States[data.state].label }}
    </p>
    <QBtn label="＄結帳" rounded color="white" text-color="black" unelevated dense size="12px" padding="3px 12px" />
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
  background-color: v-bind('bgc');
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
