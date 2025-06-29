<script setup lang="ts">
defineProps<{
  done?: boolean;
}>();
</script>

<template>
  <div
    :class="[done ? 'chip--done' : 'chip--pending']"
  >
    {{ done ? '已確認' : '待確認' }}
  </div>
</template>

<style lang="scss" scoped>
.chip {
  width: fit-content;
  height: fit-content;
  padding: 1px 4px;
  border-radius: 2px;

  &--done {
    @extend .chip;
    @include text-style($label-small, $on-surface-variant);
    background-color: $surface-variant;
  }

  &--pending {
    @extend .chip;
    @include text-style($label-small, $error);
    background-color: #b3261e29;
  }
}
</style>
