<script setup lang="ts">
defineProps<{
  data: { key: string;label: string; value: string }[];
}>();
</script>

<template>
  <ul class="table">
    <template v-for="(item, idx) in data" :key="idx">
      <div class="table__item">{{ item.label }}</div>
      <div class="table__item">
        <slot :name="item.key" :row="item">{{ item.value }}</slot>
      </div>
      <QSeparator color="black" class="table__separator" />
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 25px;
  &__item {
    padding: 10px;
  }
  &__separator {
    grid-column: span 2;
    margin-bottom: 15px;
  }
}
</style>
