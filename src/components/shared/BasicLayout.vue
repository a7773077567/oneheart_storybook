<script setup lang="ts">
</script>

<template>
  <div class="basic-layout">
    <div class="basic-layout__container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.basic-layout {
  max-width: 1440px;
  height: 100vh;
  margin: 0 auto;
  padding: 65px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &__container {
    min-width: 385px;
    display: flex;
    flex-direction: column;
  }
}
</style>
