<script setup lang="ts">
interface Props {
  label: string;
}
defineProps<Props>();
</script>

<template>
  <div class="input-box">
    <p class="input-box__label">
      {{ label }}
    </p>
    <div class="input-box__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-box {
  &__label {
    margin-bottom: 8px;
    font-weight: 700;
  }
  &__body {
    display: flex;
    align-items: center;
  }
}
</style>
