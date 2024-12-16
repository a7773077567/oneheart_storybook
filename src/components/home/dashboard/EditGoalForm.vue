<script setup lang='ts'>
import { ref } from 'vue';

export interface QuarterGoal {
  client: { name: string; id: number };
  quarter: number;
  current: number;
}

const props = defineProps<QuarterGoal>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', val: QuarterGoal): void;
}>();

const goalNumber = ref(props.current);
</script>

<template>
  <QCard class="operation_form">
    <QCardSection class="text-center operation_form__header">
      {{ client.name }}Q{{ quarter }}運營目標
    </QCardSection>
    <QCardSection class="q-px-lg">
      <form class="operation_form__content row q-col-gutter-md" @submit.prevent>
        <fieldset class="col-12">
          <QInput v-model="goalNumber" outlined label="目前目標件數" type="number" hide-bottom-space error-message="" class="col-grow" />
        </fieldset>
      </form>
    </QCardSection>
    <QCardActions class="q-pa-lg operation_form__footer">
      <QBtn label="取消" @click="$emit('cancel')" />
      <QBtn label="儲存" color="black" @click="$emit('save', { client, quarter, current: +goalNumber })" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.operation_form {
  width: 480px;
  &__header {
    font-size: 24px;
    font-weight: 600;
    text-align: start;
  }
  &__footer {
    justify-content: end;
  }
}
</style>
