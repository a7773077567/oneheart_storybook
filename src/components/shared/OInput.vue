<script setup lang="ts">
import { useField } from 'vee-validate';
import type { QInputProps } from 'quasar';
import type { Optional } from '@/types/utilities';

interface Props extends /* @vue-ignore */ Optional<QInputProps, 'modelValue'> {
  name: string;
  customRule?: any;
}
const props = defineProps<Props>();

const { value, errorMessage } = useField<string>(() => props.name, props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});
</script>

<template>
  <QInput
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
  />
</template>

<style lang="scss" scoped>

</style>
