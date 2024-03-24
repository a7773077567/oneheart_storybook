<script setup lang="ts">
interface TableData {
  key: string;
  value?: string;
  slotName?: string;
}
interface Props {
  data: TableData[];
}

defineProps<Props>();
</script>

<template>
  <div class="table">
    <div
      v-for="({ key, slotName, value }, idx) in data"
      :key="idx"
      class="table__row"
    >
      <span class="table__cell--key">{{ key }}</span>
      <span class="table__cell">
        <slot :name="slotName">
          {{ value }}
        </slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-color: #79747e;
.table {
  &__row {
    display: grid;
    grid-template-columns: minmax(105px, auto) 1fr;
    font-size: 16px;
    border: 1px solid $border-color;
    &:not(:last-child) {
      border-bottom: 0;
    }
  }
  &__cell {
    padding: 10px;
    &:not(:last-child) {
      border-right: 1px solid $border-color;
    }
    &--key {
      @extend .table__cell;
      display: flex;
      align-items: center;
    }
  }
}
</style>
