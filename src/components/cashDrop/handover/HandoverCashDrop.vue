<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <div class="cash-drop">
    <div class="cash-drop__title">請先完成投庫</div>
    <QInput v-model="model" outlined dense type="number" />
  </div>
</template>

<style lang="scss" scoped>
.cash-drop {
  &__title {
    font-size: 20px;
    line-height: 30px;
    letter-spacing: 0.1px;
    margin-bottom: 16px;
  }
}
</style>
