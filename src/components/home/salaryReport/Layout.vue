<script setup lang="ts">

</script>

<template>
  <div class="layout">
    <div class="layout__header">
      <slot name="header" />
    </div>
    <div class="layout__body">
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: scroll;
  &__header {
    display: grid;
    grid-template-columns: auto auto auto 1fr;
    align-items: center;
    gap: 24px;
  }
}
</style>
