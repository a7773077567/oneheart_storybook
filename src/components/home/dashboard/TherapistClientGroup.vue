<script setup lang="ts">
import { QTable } from 'quasar';
import type { QTableColumn, QTableProps } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  rows: QTableProps['rows'];
  pagination: QTableProps['pagination'];
}>();

const emit = defineEmits<{
  (e: 'update:pagination', val: QTableProps['pagination']): void;
  (e: 'request', val: Record<string, any>): void;
}>();

const paginationModel = computed({
  get: () => props.pagination,
  set: val => emit('update:pagination', val),
});

const table = ref<QTable | null>(null);
const columns: QTableColumn[] = [
  { name: 'clientName', field: 'clientName', label: '客戶', align: 'left', style: 'width: 170px' },
  { name: '物理治療', field: '物理治療', label: '物理治療', align: 'center' },
  { name: '院長物理治療', field: '院長物理治療', label: '院長物理治療', align: 'center' },
  { name: '營養', field: '營養', label: '營養', align: 'center' },
  { name: '教練課', field: '教練課', label: '教練課', align: 'center' },
  { name: '震波', field: '震波', label: '震波', align: 'center' },
  { name: '射頻', field: '射頻', label: '射頻', align: 'center' },
  { name: '磁波', field: '磁波', label: '磁波', align: 'center' },
  { name: 'G動椅', field: 'G動椅', label: 'G動椅', align: 'center' },
];

onMounted(() => {
  table.value!.requestServerInteraction();
});
</script>

<template>
  <div class="group">
    <div class="group__header">
      <div class="title">客戶堂數總覽</div>
    </div>
    <div class="group__body">
      <QTable
        ref="table"
        v-model:pagination="paginationModel"
        flat
        :columns="columns"
        :rows="rows"
        class="table"
        @request="$emit('request', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group {
  &__header {
    padding: 20px 0;
    margin-bottom: 2px;
  }
}
.title {
  color: #1a1b21;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.table {
  :deep(th) {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.1px;
  }

  :deep(td) {
    padding: 16px;
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }
}
</style>
