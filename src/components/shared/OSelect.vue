<script setup lang="ts">
import { useField } from 'vee-validate';
import type { QSelectProps } from 'quasar';
import type { Optional } from '@/types/utilities';

interface Props extends /* @vue-ignore */ Optional<QSelectProps, 'modelValue'> {
  name: string;
  customRule?: any;
}
const props = defineProps<Props>();

const { value, errorMessage } = useField<string>(() => props.name, props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});
</script>

<template>
  <QSelect
    v-bind="props"
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
  />
</template>

<style lang="scss" scoped>

</style>
