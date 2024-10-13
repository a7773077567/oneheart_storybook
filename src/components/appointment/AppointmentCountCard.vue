<script setup lang="ts">
defineProps<{
  count: number;
  isCheckout?: boolean;
}>();
</script>

<template>
  <div :class="[isCheckout ? 'appointment-count-card--checkout' : 'appointment-count-card']">
    <span :class="[isCheckout ? 'appointment-count-card__count--checkout' : 'appointment-count-card__count']">{{ count }}</span>
  </div>
</template>

<style lang="scss" scoped>
.appointment-count-card {
  // max-width: 105px;
  height: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: #f8c9cb;
  cursor: pointer;

  &--checkout {
    @extend .appointment-count-card;
    background-color: #a5d6f1;
  }

  &__count {
    font-size: 35px;
    font-weight: 700;
    color: #e86969;

    &--checkout {
      @extend .appointment-count-card__count;
      color: #0097eb;
    }
  }
}
</style>
