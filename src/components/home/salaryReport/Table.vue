<script setup lang="ts">
</script>

<template>
  <QTable
    v-bind="$attrs"
    class="table"
    hide-pagination
  >
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="slotData" />
    </template>
  </QTable>
</template>

<style lang="scss" scoped>
.table {
  box-shadow: none;
}

:deep(th) {
  @include text-style($label-large, $on-surface);
}

:deep(td) {
  @include text-style($body-medium, $on-surface);
}
</style>
