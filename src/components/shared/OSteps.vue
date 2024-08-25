<script setup lang='ts'>
import { computed } from 'vue';
import { QBreadcrumbs } from 'quasar';

interface Step {
  label: string;
  key: string;
}

const props = defineProps<{
  steps: Step[];
  currentStep: Step;
}>();

const currentStepCount = computed(() => props.steps.findIndex(step => step.key === props.currentStep.key) ?? 0);
</script>

<template>
  <QBreadcrumbs class="o-steps text-grey" active-color="black">
    <template #separator>
      <hr class="separator">
    </template>
    <template v-for="(step, stepCount) in steps" :key="step.key">
      <QBreadcrumbsEl>
        <div class="o-steps__el" :class="{ 'o-steps__el--waiting': currentStepCount < stepCount }">
          <div class="icon">{{ currentStepCount > stepCount ? '&check;' : stepCount + 1 }}</div>
          <span class="label">{{ step.label }}</span>
        </div>
      </QBreadcrumbsEl>
    </template>
  </QBreadcrumbs>
</template>

<style scoped lang="scss">
.o-steps {
  padding: 16px 0;
  &__el {
    display: flex;
    align-items: items;
    .icon {
      width: 20px;
      height: 20px;
      border: 1px solid black;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      background: black;
      color: white;
      font-size: 12px;
    }
    .label {
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      color: black;
    }

    &--waiting {
      .icon {
        background: white;
        color: black;
      }
      .label {
        color: #9e9e9e;
      }
    }
  }

  .separator {
    width: 40px;
    color: #d9d9d9;
  }
}
</style>
