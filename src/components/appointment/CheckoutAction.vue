<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [val: number];
  checkout: [];
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
</script>

<template>
  <div class="checkout-action">
    <div class="checkout-action__amount">
      <p>交易總金額：</p>
      <QInput v-model.number="model" type="number" outlined dense style="width: 120px;" />
      <span>元</span>
    </div>

    <div class="checkout-action__checkout">
      <QBtn label="結帳" outline style="width: 150px; font-size: 16px" @click="$emit('checkout')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkout-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #000;
  &__amount {
    display: flex;
    align-items: center;
    gap: 20px;
    > p {
      font-weight: 600;
    }
  }
}
</style>
