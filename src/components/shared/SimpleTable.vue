<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  fields: {
    name: string;
    label: string;
    width?: string;
    currency?: boolean;
  }[];
  rows: Record<string, {
    val: any;
    span?: number;
    icon?: string;
    color?: string;
  }>[];
}>();

const rowData = computed(() => {
  return props.rows.map((row) => {
    return Object.entries(row).sort(([aKey], [bKey]) => {
      const aIdx = props.fields.findIndex(field => field.name === aKey);
      const bIdx = props.fields.findIndex(field => field.name === bKey);
      return aIdx - bIdx;
    }).map(([key, val]) => {
      const isCurrency = props.fields.find(field => field.name === key)?.currency;
      return isCurrency
        ? { ...val, val: Number(val.val).toLocaleString('en') }
        : val;
    });
  });
});

function getIconPath(iconName: string) {
  return iconName.startsWith('/')
    ? `img:${iconName}`
    : iconName;
}
</script>

<template>
  <table class="simple-table">
    <colgroup>
      <col
        v-for="(field, idx) in fields"
        :key="idx"
        :style="`width: ${field.width}`"
      >
    </colgroup>
    <thead>
      <tr>
        <th
          v-for=" (field, idx) in fields"
          :key="idx"
          class="simple-table__cell--col"
        >
          {{ field.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in rowData" :key="idx">
        <td
          v-for="(cell, cellIdx) in row"
          :key="cellIdx"
          :class="[cell.icon ? 'simple-table__cell--icon' : 'simple-table__cell']"
          :colspan="cell.span ?? 1"
          :style="{ color: cell.color ?? '' }"
        >
          <div class="simple-table__cell-box">
            <QIcon v-if="cell.icon" :name="getIconPath(cell.icon)" size="24px" />
            <span>{{ cell.val }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.simple-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  &__cell {
    height: 48px;
    padding: 0 12px;
    vertical-align: middle;
    border: 1px solid black;
    font-size: 14px;
    &--col {
      @extend .simple-table__cell;
      text-align: left;
    }
    &--icon {
      @extend .simple-table__cell;
    }
  }
  &__cell-box {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
