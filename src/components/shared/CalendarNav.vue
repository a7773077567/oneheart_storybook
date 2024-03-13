<script setup lang="ts">
defineEmits<{
  prev: [];
  today: [];
  next: [];
}>();
</script>

<template>
  <div class="nav">
    <div class="nav__item" @click="$emit('prev')">
      {{ '< 上一頁' }}
    </div>
    <div class="nav__item" @click="$emit('today')">
      今天
    </div>
    <div class="nav__item" @click="$emit('next')">
      {{ '下一頁 >' }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  width: fit-content;
  display: flex;
  &__item {
    display: flex;
    align-items: center;
    padding: 7.5px 21px;
    border: 1px solid black;
    font-size: 12px;
    cursor: pointer;
    &:first-child {
      padding: 7.5px 11px;
      border-radius: 15px 0 0 15px;
    }
    &:last-child {
      padding: 7.5px 11px;
      border-radius: 0 15px 15px 0;
    }
  }
}
</style>
