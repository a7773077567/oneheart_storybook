<script setup lang='ts'>
import { ReviewState } from '@/api';
import { computed } from 'vue';

const props = defineProps<{
  state: ReviewState;
}>();

const colors = computed(() => {
  switch (props.state) {
    case ReviewState['已批准']:
      return ({ bg: 'surface-variant', color: 'on-surface-variant' });
    case ReviewState['已駁回']:
      return ({ bg: 'error-16', color: 'error' });
    case ReviewState['待審核']:
    default:
      return ({ bg: 'warning-container', color: 'on-warning-container' });
  }
});
</script>

<template>
  <QChip square :class="[`text-${colors.color}`, `bg-${colors.bg}`]" dense size="md">
    <div class="text-label-small flex justify-center" style="width:34px">{{ ReviewState[state] }}</div>
  </QChip>
</template>
