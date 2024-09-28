<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    state: string;
    name: string;
    date: string;
  }[];
}>();

const lastHistory = computed(() => props.data[0]);
const restHistories = computed(() => props.data.slice(1, props.data.length));
</script>

<template>
  <QExpansionItem v-if="data.length" expand-icon="arrow_drop_down">
    <template #header>
      <div class="last-history">
        <div class="history">
          <div class="history__item--state">{{ lastHistory?.state }}</div>
          <div class="history__item--name">{{ lastHistory?.name }}</div>
          <div class="history__item--date">{{ lastHistory?.date }}</div>
        </div>
        <span class="label">歷程紀錄</span>
      </div>
    </template>
    <div class="histories">
      <div v-for="(item, idx) in restHistories" :key="idx" class="history">
        <div class="history__item--state">{{ item.state }}</div>
        <div class="history__item--name">{{ item.name }}</div>
        <div class="history__item--date">{{ item.date }}</div>
      </div>
    </div>
  </QExpansionItem>
</template>

<style lang="scss" scoped>
.histories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}
.history {
  &__item {
    font-family: Roboto;
    font-size: 14px;
    display: inline-block;
    &--state {
      @extend .history__item;
      width: 68px;
      font-size: 16px;
    }
    &--name {
      @extend .history__item;
      margin-left: 12px;
    }
    &--date {
      @extend .history__item;
      margin-left: 8px;
    }
  }
}

.last-history {
  display: flex;
  gap: 16px;
  align-items: center;
}

.label {
  font-size: 14px;
  font-weight: 500;
}

:deep(.q-expansion-item__container) {
  > .q-item {
    min-height: initial;
    margin-bottom: 2px;
    > .q-item__section {
      padding-right: 0;
    }
  }
}
</style>
