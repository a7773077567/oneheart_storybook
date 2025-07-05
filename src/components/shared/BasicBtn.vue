<script setup lang="ts">
import { QBtn } from 'quasar';
import type { QBtnProps, QBtnSlots } from 'quasar';
import { type Slot, type Slots, useSlots } from 'vue';

const props = withDefaults(
  defineProps<QBtnProps>(),
  {
    color: 'primary',
  },
);

defineSlots<AllSlots>();

type AllSlots = {
  [K in keyof QBtnSlots]?: Slot | undefined
} ;

const slots = useSlots() as AllSlots;
</script>

<template>
  <QBtn v-bind="props" padding="10px 24px" class="btn">
    <template
      v-for="(_, name) in slots "
      :key="name"
      #[name]
    >
      <slot :name="name" />
    </template>
  </QBtn>
</template>

<style lang="scss" scoped>
.btn {
  padding: 10px 24px;
  border-radius: 100px;
  :deep(.block) {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
}
</style>
