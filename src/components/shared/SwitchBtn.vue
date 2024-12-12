<script setup lang='ts' generic="T">
defineProps<{
  modelValue: T;
  options: { label: string; value: T }[];
}>();

defineEmits<{
  (e: 'update:modelValue', val: T): void;
}>();
</script>

<template>
  <div class="switch_bar">
    <div
      v-for="option in options" :key="option.value"
      class="option"
      :class="{ 'option--active': option.value === modelValue }"
      @click="$emit('update:modelValue', option.value)"
    >
      <QIcon v-if="option.value === modelValue " name="check" />
      {{ option.label }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.switch_bar {
  display: flex;
  width: fit-content;
  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 104px;
    padding: 10px 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    &:first-child {
      border: 2px solid #767680;
      border-left: 2px solid #767680;
      border-radius: 8px 0 0 8px;
    }
    &:last-child {
      border: 2px solid #767680;
      border-radius: 0 8px 8px 0;
      border-left: 0;
    }
    &--active {
      background: #dfeafc;
    }
  }
}
</style>
