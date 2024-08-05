<script setup lang="ts">
import { useField } from 'vee-validate';
import type { QCheckboxProps } from 'quasar';
import type { Optional } from '@/types/utilities';

interface Props extends /* @vue-ignore */ Optional<QCheckboxProps, 'modelValue'> {
  name?: string;
}
const props = defineProps<Props>();

const { value } = useField<string>(() => props.name || 'field', undefined, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});
</script>

<template>
  <QCheckbox
    v-model="value"
    dense
  />
</template>

<style lang="scss" scoped>

</style>
