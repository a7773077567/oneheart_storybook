<script setup lang="ts">
import type { UserInProgressClientSchedule } from '@/api';
import { computed } from 'vue';

const props = defineProps<{
  data: UserInProgressClientSchedule[];
}>();

defineEmits<{
  (e: 'choose', val: UserInProgressClientSchedule[]): void;
}>();

const count = computed(() => props.data.length);
const isComplete = computed(() => props.data.every(item => item.state >= 4));
const label = computed(() => isComplete.value ? '完成' : '未完成');
</script>

<template>
  <div
    :class="[isComplete ? 'personal-appointment-card--complete' : 'personal-appointment-card--incomplete']"
    @click="$emit('choose', data)"
  >
    <div class="personal-appointment-card__count">{{ count }}</div>
    <div class="personal-appointment-card__label">{{ label }}</div>
  </div>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}

.personal-appointment-card {
  padding: 4px 12px 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  @include mobile {
    justify-content: center;
  }
  &--complete {
    @extend .personal-appointment-card;
    background-color: rgba(223, 234, 252, 1);
  }
  &--incomplete {
    @extend .personal-appointment-card;
    background-color: rgba(250, 223, 214, 1);
  }
  &__count {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
  &__label {
    color: #45464f;
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    @include mobile {
      display: none;
    }
  }
}
</style>
