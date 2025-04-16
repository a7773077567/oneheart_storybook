<script setup lang="ts">
import type { QSelectProps } from 'quasar';
import { computed } from 'vue';

defineProps<{
  options: QSelectProps['options'];
}>();

const model = defineModel();

const popupContentStyle = computed(() => {
  return {
    'width': '200px',
    'background': '#F8FBFF',
    'border-radius': '1px',
  };
});
</script>

<template>
  <QSelect
    v-model="model"
    v-bind="$attrs"
    :options="options"
    dense
    emit-value
    borderless
    map-options
    popup-content-class="simple-select-content"
    :popup-content-style="popupContentStyle"
    :menu-offset="[0, 12]"
  >
    <template #option="scope">
      <QItem v-bind="scope.itemProps" class="option">
        <QItemSection>
          <QItemLabel>{{ scope.opt.label }}</QItemLabel>
        </QItemSection>
      </QItem>
    </template>
  </QSelect>
</template>

<style lang="scss" scoped>
:deep(.q-field__native > span) {
  @include text-style($title-medium, $on-surface-variant);
}

:global(.simple-select-content) {
  .q-virtual-scroll__content {
    border-radius: 4px !important;
  }
}

:deep(.q-field__append) {
  padding-left: 20px !important;
}

:deep(.q-field__append > .q-icon) {
  color: $on-surface-variant;
}

.option {
  &.q-item {
    padding: 14px 12px;
  }
  &.q-item--active {
    background-color: $secondary-container;
  }
  .q-item-section {
    padding: 0;
  }
  .q-item__label {
    @include text-style($body-large, $on-surface);
    line-height: 28px !important;
  }
}
</style>
