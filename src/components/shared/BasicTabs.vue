<script setup lang="ts">
defineProps<{
  tabs: { name: string; label: string }[];
  modelValue: string; // active tab
}>();

defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();
</script>

<template>
  <div class="tabs">
    <div
      v-for="(tab, idx) in tabs"
      :key="idx"
      :class="[modelValue === tab.name ? 'tabs__tab--active' : 'tabs__tab']"
      @click="$emit('update:modelValue', tab.name)"
    >
      <QIcon v-if="modelValue === tab.name" size="18px" name="check" />
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border: 1px solid $outline;

.tabs {
  display: flex;
  border-radius: 8px;
  border: $border;
  overflow: hidden;
  &__tab {
    width: 141px;
    padding: 10px 0;
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 150ms ease-out;
    span {
      @include text-style($label-large, $on-secondary-container);
    }
    &:not(:last-child) {
      border-right: $border;
    }

    &--active {
      @extend .tabs__tab;
      background-color: $secondary-container;
    }
  }
}
</style>
