<script setup lang="ts">
interface Props {
  disable: boolean;
}
defineProps<Props>();
defineEmits<{
  add: [];
}>();
</script>

<template>
  <div class="booking-adder" :class="{ 'bg-grey-4': disable }">
    <QBtn v-if="!disable" icon="add" size="14px" dense flat round class="cursor-pointer q-pa-sm" />
  </div>
</template>

<style lang="scss" scoped>
.booking-adder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
