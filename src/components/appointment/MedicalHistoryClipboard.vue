<script setup lang="ts">
import { mapValues } from 'radash';
import { computed, onMounted, ref, watch } from 'vue';

defineProps<{
  data: any[];
}>();

const emit = defineEmits<{
  select: [record: Record<string, any>];
}>();

const expandIdx = ref<number | null>(null);
const expandedBodyHeight = ref<string>('72px');

const ccOrders = ref<number[]>([]);

onMounted(() => {
  const ccOrderDoms = [...document.querySelectorAll<HTMLDivElement>('.order--cc')];
  ccOrders.value = ccOrderDoms.map(dom => dom.clientHeight);
});

watch(expandIdx, (newVal) => {
  if (newVal === null) {
    return;
  }
  const expandedBody = document.querySelector<HTMLDivElement>('.history__body--expanded')!;
  expandedBodyHeight.value = `${expandedBody.scrollHeight}px`;
}, { flush: 'post' });

function expandHistory(idx: number) {
  if (expandIdx.value === idx) {
    expandIdx.value = null;
    return;
  }
  expandIdx.value = idx;
}

function selectRecord(record: Record<string, any>) {
  emit('select', mapValues(record, val => val.value));
}
</script>

<template>
  <div class="medical-history-clipboard">
    <div v-for="(item, idx) in data" :key="idx" class="history">
      <div class="history__header">
        <div class="history__date">{{ item.date }}</div>
        <div class="history__actions">
          <QBtn icon="content_copy" label="套用病例" flat style="color: #137AB3;" @click="() => selectRecord(item.record)" />
          <QBtn icon="arrow_drop_down" :class="[expandIdx === idx ? 'expand-icon--expanded' : 'expand-icon']" round flat @click="() => expandHistory(idx)" />
        </div>
      </div>
      <div :class="[expandIdx === idx ? 'history__body--expanded' : 'history__body']" :style="{ height: `${ccOrders[idx]}px` }">
        <div v-for="(record, key, recordIdx) in item.record" :key="record" :class="[recordIdx === 0 ? 'order--cc' : 'order']">
          <div class="order__type">{{ record.label }}</div>
          <div :class="[expandIdx === idx ? 'order__detail--expanded' : 'order__detail']">{{ record.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medical-history-clipboard {
  width: 640px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #fff;
}

.history {
  padding: 8px 8px 16px 16px;
  background: #f3f3f3;
  border-radius: 4px;

  &__date {
    font-size: 16px;
    font-weight: 700;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  &__actions {
    display: flex;
  }
  &__body {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 350ms ease;
    // height: 72px;
    &--expanded {
      @extend .history__body;
      height: v-bind(expandedBodyHeight) !important;
    }
  }
}

.order {
  &__type {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  &__detail {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    &--expanded {
      text-overflow: initial;
      overflow: initial;
      display: block;
      -webkit-line-clamp: initial;
      -webkit-box-orient: initial;
    }
  }
}

.expand-icon {
  transition: all 300ms ease-in;
  &--expanded {
    @extend .expand-icon;
    rotate: 180deg;
  }
}
</style>
