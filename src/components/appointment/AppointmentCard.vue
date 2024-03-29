<script setup lang="ts">
import type { BookingItem } from '@/api/appointment';
import { computed } from 'vue';
import { TherapyTypes } from '@/const/general';

interface BookingState {
  identifier: number;
  name: string;
  label: string;
  color: string;
}
const props = defineProps<Props>();

const States: BookingState[] = [
  {
    identifier: 0,
    name: 'appointment',
    label: '預約',
    color: '#FFFFFF',
  },
  {
    identifier: 1,
    name: 'checkIn',
    label: '報到',
    color: '#88F2D8',
  },
  {
    identifier: 2,
    name: 'serviceDone',
    label: '完成服務',
    color: '#E86969',
  },
  {
    identifier: 3,
    name: 'recordDone',
    label: '病例完成',
    color: '#FFFFFF',

  },
];

interface Props {
  data: BookingItem;
}
const bgc = computed(() => props.data.isCheckout ? '#A5D6F1' : '#F8C9CB');
const type = computed(() => {
  const types = Object.values(TherapyTypes);
  return types[props.data.type];
});
const stateColor = computed(() => States[props.data.state].color);
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
