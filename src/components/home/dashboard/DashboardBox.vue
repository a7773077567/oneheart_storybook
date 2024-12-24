<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="box">
    <div v-if="title || $slots.select" class="box__header">
      <div class="title">{{ title }}</div>
      <slot name="select" />
    </div>
    <div class="box__body">
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  &__header {
    display: flex;
    gap: 16px;
    align-items: center;
    // margin-bottom: 20px;
    padding: 16px 0;
  }

  &__body {
    width: 1084px;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #dbdae7;
    background: #eff4fb;
  }
}

.title {
  color: #1a1b21;
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
}
</style>
