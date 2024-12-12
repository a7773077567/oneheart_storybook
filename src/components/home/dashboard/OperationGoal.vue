<script setup lang='ts'>
import { computed } from 'vue';
import dayjs from 'dayjs';

export interface Goal {
  quarter: number;
  current: number;
  goal: number;
}

const props = defineProps<{
  list: Goal[];
}>();

defineEmits<{
  (e: 'update'): void;
}>();

const renderList = computed(() => {
  return props.list.map(q => ({ ...q, ifExpired: dayjs().quarter() > q.quarter }));
});
</script>

<template>
  <QList separator class="goal_list">
    <QItem v-for="item in renderList" :key="item.quarter" class="q-pa-none">
      <QItemSection class="item--title">
        Q{{ item.quarter }}
      </QItemSection>
      <QItemSection>
        <QItemLabel class="item--label">目前件數</QItemLabel>
        <QItemLabel class="item--val">{{ item.current }}</QItemLabel>
      </QItemSection>
      <QItemSection>
        <QItemLabel class="item--label">目標件數</QItemLabel>
        <QItemLabel class="item--val">{{ item.goal }}</QItemLabel>
      </QItemSection>
      <QItemSection side>
        <QBtn :disable="item.ifExpired" flat round icon="edit" size="12px" />
      </QItemSection>
    </QItem>
  </QList>
</template>

<style scoped lang="scss">
.goal_list {
  .item {
    &--title {
      font-size: 18px;
      font-weight: 500;
    }
    &--label {
      color: #45464f;
      font-size: 12px;
      font-weight: 500;
    }
    &--val {
      font-weight: 500;
      font-size: 16px;
    }
  }
}
</style>
