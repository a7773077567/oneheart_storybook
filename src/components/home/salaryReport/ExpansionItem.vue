<script setup lang="ts">
import { MoneyDisplay } from '@/components/home/salaryReport';
import { name } from 'node_modules/@azure/msal-browser/dist/packageMetadata';
import { QExpansionItem } from 'quasar';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  label: string;
  amount: number;
  showAmount: boolean;
  details: any[][];
  disable?: boolean;
}>(), {
  modelValue: false,
});

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const expanded = ref(props.modelValue);
const expansionItem = ref<QExpansionItem | null>(null);

const rows = computed(() => {
  return props.details.map((detail, detailIdx) => {
    return detail.map((item, idx) => {
      return {
        value: Array.isArray(item) ? item : [item],
        style: [
          idx === detail.length - 1 && `grid-column: ${idx + 1} / -1;`,
          detailIdx === props.details.length - 1 && `border-bottom: none`,
        ],
        class: [
          idx === 1 ? 'rows__row--amount' : 'rows__row',

        ],
      };
    });
  }).flat();
});

watch(() => props.disable, (newVal) => {
  if (newVal) {
    expansionItem.value?.hide();
  }
});
</script>

<template>
  <QExpansionItem
    ref="expansionItem"
    :model-value="expanded"
    expand-icon="arrow_drop_down"
    class="expansion-item"
    :header-class="{ 'header--expanded': expanded }"
    :disable="disable"
    @update:model-value="expanded = $event, $emit('update:modelValue', $event)"
  >
    <slot name="body">
      <div class="rows">
        <div
          v-for="(row, idx) in rows"
          :key="idx"
          :class="row.class"
          :style="row.style"
        >
          <slot
            :name="`row-${idx}`"
            :row="row"
          >
            <div
              v-for="(item, itemIdx) in row.value"
              :key="itemIdx"
              :class="[row.value.length > 1 ? 'rows__item--nested' : 'rows__item']"
            >
              {{ item }}
            </div>
          </slot>
        </div>
      </div>
    </slot>

    <template #header>
      <slot name="tooltip" />
      <QItemSection avatar style="width: 180px;">
        <p class="label">{{ label }}</p>
      </QItemSection>
      <QItemSection>
        <MoneyDisplay
          :model-value="showAmount"
          :dot-number="5"
          :amount="amount"
        />
      </QItemSection>
    </template>
  </QExpansionItem>
</template>

<style lang="scss" scoped>
.label {
  @include text-style($title-small, $on-surface);
}

.expansion-item {
  color: $primary;
  border-bottom: 1px solid $outline-variant;
}

.rows {
  display: grid;
  grid-template-columns: 180px 240px minmax(161px, auto) 1fr;
  align-items: stretch;
  &__row {
    padding: 22px 16px;
    @include text-style($label-large, $on-surface-variant);

    &:not(:last-child) {
      border-bottom: 1px solid $outline-variant;
    }

    &--amount {
      @extend .rows__row;
      @include text-style($body-large, $on-surface);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
    @include text-style($label-large, $on-surface-variant);

    &--nested {
      @extend .rows__item;
      padding: 18px 0;
      &:first-child {
        padding-top: 0;
      }
      &:not(:last-child) {
        border-bottom: 1px solid $outline-variant;
      }
    }
  }
}

:deep(.q-item) {
  &:hover {
    background-color: rgba(29, 27, 32, 0.08);
  }
}

:deep(.header--expanded) {
  background-color: rgba(26, 122, 179, 0.08);
}

:deep(.q-expansion-item__toggle-icon) {
  color: $primary;
}

:deep(.q-item) {
  padding: 16px;
}

:slotted(span) {
  @include text-style($label-large, $on-surface-variant);
}
</style>
