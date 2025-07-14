<script setup lang='ts'>
withDefaults(defineProps<{
  title?: string;
  width?: string;
  height?: string;
}>(), {
  width: '480px',
  height: 'fit-content',
});
</script>

<template>
  <QCard v-bind="$attrs" class="basic_card" :style="{ width, height }">
    <QCardSection class="q-pa-lg">
      <slot name="header">
        <h2 class="text-headline-small">{{ title }}</h2>
      </slot>
    </QCardSection>
    <QCardSection class="q-px-lg q-py-none basic_card__body">
      <slot name="body" />
    </QCardSection>
    <QCardActions class="q-pa-lg justify-end q-mt-auto">
      <slot name="footer" />
    </QCardActions>
  </QCard>
</template>

<style lang="scss" scoped>
.basic_card {
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  &__body {
    flex: 1;
  }
}
</style>
