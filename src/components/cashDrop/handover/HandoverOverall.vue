<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    totalRevenue: number;
    initialCash: number;
    cashFlow: number;
    totalCashDrop: number;
    remainingCash: number;
  };
}>();

const overAllData = computed(() => {
  const fields = [
    { label: '總收入', name: 'totalRevenue' },
    { label: '初始現金', name: 'initialCash' },
    { label: '現金收支', name: 'cashFlow' },
    { label: '投庫總額', name: 'totalCashDrop' },
    { label: '剩餘現金', name: 'remainingCash' },
  ];
  return Object.entries(props.data).sort(([aKey], [bKey]) => {
    const aIdx = fields.findIndex(field => field.name === aKey);
    const bIdx = fields.findIndex(field => field.name === bKey);
    return aIdx - bIdx;
  }).map(([key, val]) => {
    const label = fields.find(field => field.name === key)?.label;
    return { label, name: key, val: Number(val).toLocaleString('en') };
  });
});
</script>

<template>
  <div class="overall">
    <template v-for="(item, idx) in overAllData" :key="idx">
      <div class="overall__item">
        <div class="overall__item-label">{{ item.label }}</div>
        <div :class="[item.name === 'remainingCash' ? 'overall__item-val--remaining' : 'overall__item-val']">{{ item.val }}</div>
      </div>
      <QSeparator v-if="idx === 0" vertical color="grey-5" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.overall {
  display: flex;
  gap: 24px;
  &__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &__item-label {
    line-height: 24px;
  }
  &__item-val {
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    &--remaining {
      @extend .overall__item-val;
      font-size: 24px;
    }
  }
}
</style>
