<script setup lang="ts">
import { useField } from 'vee-validate';
import type { QFileProps } from 'quasar';
import type { Optional } from '@/types/utilities';

interface Props extends /* @vue-ignore */ Optional<QFileProps, 'modelValue'> {
  name?: string;
}
const props = defineProps<Props>();

const { value } = useField<any[] | File | FileList | null | undefined>(() => props.name || '', undefined, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});
</script>

<template>
  <QFile v-model="value" filled clearable counter style="width: 350px;">
    <template #prepend>
      <QIcon name="attach_file" />
    </template>
  </QFile>
</template>

<style lang="scss" scoped>

</style>
