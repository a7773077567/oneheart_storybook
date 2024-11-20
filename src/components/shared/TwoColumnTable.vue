<script setup lang="ts">
defineProps<{
  data: {
    key: string;
    value?: any;
    label?: string;
    span?: boolean;
    custom?: boolean;
  }[];
}>();
</script>

<template>
  <div class="table">
    <div v-for="(item, idx) in data" :key="idx" :class="[item.span ? 'table__cell--span' : 'table__cell']">
      <div v-if="item.custom" class="cell--custom">
        <slot :name="item.key" :data="item" />
      </div>
      <div v-else class="cell">
        <div class="cell__item">{{ item.label }}：</div>
        <div class="cell__item">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  &__cell {
    &--span {
      grid-column: 1 / span 2;
    }
  }
}

.cell {
  display: grid;
  grid-template-columns: max-content 1fr;
  height: 100%;
  border: 1px solid black;
  &--custom {
    @extend .cell;
    display: block;
  }
  &__item {
    padding: 10px;
  }
}
</style>
