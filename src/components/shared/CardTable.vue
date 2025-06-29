<script setup lang="ts">
import { is } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  data: ({
    value: any;
    isPassed?: boolean;
    isUsed?: boolean;
  } | string)[][];
  showDataTitle?: boolean;
  caption?: string[];
  fieldWidth?: string;
  valueWidth?: string;
  valueAlign?: string;
}>();

const gridItems = computed(() => {
  return props.data.map((item, idx) => {
    return item.map((ele, eleIdx) => {
      if (typeof ele === 'string') {
        return {
          value: ele,
          class: [
            eleIdx === 0 ? 'grid__item--field' : 'grid__item--value',
          ],
          style: {
            'justify-content': (eleIdx !== 0 && props.valueAlign) ? props.valueAlign : 'flex-start',
            'border-bottom': (!props.caption && idx === props.data.length - 1) ? 'none' : undefined,
          },
        };
      }
      return {
        value: ele.value,
        class: [
          eleIdx === 0 ? 'grid__item--field' : 'grid__item--value',
        ],
        style: {
          'background-color': ele.isPassed ? '#C8EEBF' : ele.isUsed ? '#1A7AB3' : '#fff',
          'color': ele.isUsed ? '#fff' : '#1A1B21',
          'justify-content': (eleIdx !== 0 && props.valueAlign) ? props.valueAlign : 'flex-start',
          'border-bottom': (!props.caption && idx === props.data.length - 1) ? 'none' : undefined,
        },
        isPassed: ele.isPassed,
        isUsed: ele.isUsed,
      };
    });
  }).flat();
});

const gridStyle = computed(() => {
  return {
    'grid-template-columns': `${props.fieldWidth ?? '240px'} repeat(${props.data[0].length - 1}, ${props.valueWidth ?? '1fr'})`,
  };
});
</script>

<template>
  <div class="card">
    <div class="card__header">
      <div class="title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </div>
    <div class="card__body">
      <div v-if="$slots['grid-title']" class="card__body-title">
        <slot name="grid-title" />
      </div>

      <div class="grid" :style="gridStyle">
        <div
          v-for="(item, idx) in gridItems"
          :key="idx"
          :class="item.class"
          :style="item.style"
        >
          {{ item.value }}{{ ` ${item.isUsed ? '當前採用' : ''}` }}
        </div>
      </div>
    </div>
    <div v-if="caption" class="card__caption">
      <div class="caption">
        <div class="caption__title">說明事項：</div>
        <ul>
          <li />
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$background: #f7f7f8;

.card {
  border: 1px solid $outline-variant;
  border-radius: 8px;
  overflow: hidden;
  &__header {
    padding: 16px;
    background-color: $background;
  }
  &__body {
    overflow: scroll;
  }

  &__body-title {
    padding: 16px;
  }

  &__caption {
    padding: 16px;
    background-color: $background;
  }
}

.title {
  @include text-style($label-large, $on-surface);
}

.grid {
  display: grid;
  padding: 0 16px 16px;
  overflow: scroll;
  &__item {
    padding: 14px 16px;
    border-bottom: 1px solid $outline-variant;
    display: flex;
    @include text-style($label-large, $on-surface-variant);
    &--field {
      @extend .grid__item;
    }
    &--value {
      @extend .grid__item;
    }
  }
  &__title {
  }
}

.caption {
  &__title {
    @include text-style($body-medium, $on-surface-variant);
  }
}
</style>
