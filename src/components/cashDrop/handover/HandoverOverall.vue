<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    totalIncome: number;
    totalCashIncome: number;
    totalCashDropAmount: number;
    balanceDifference: number;
  };
}>();

const overAllData = computed(() => {
  const fields = [
    { label: '總收入', name: 'totalIncome' },
    { label: '現金總收入', name: 'totalCashIncome' },
    { label: '投庫總額', name: 'totalCashDropAmount' },
    { label: '交班現金差額', name: 'balanceDifference' },
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
        <div class="overall__item-val">{{ item.val }}</div>
      </div>
      <!-- <QSeparator v-if="idx === 0" vertical color="grey-5" /> -->
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
  }
}
</style>
