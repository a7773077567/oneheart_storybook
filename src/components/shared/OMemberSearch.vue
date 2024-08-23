<script setup lang="ts">
import { ref } from 'vue';
import { useField } from 'vee-validate';
import type { QSelectProps } from 'quasar';
import type { Optional } from '@/types/utilities';
import { fetchClients } from '@/api';
import { debounce } from 'radash';

interface Props extends /* @vue-ignore */ Optional<QSelectProps, 'modelValue'> {
  name: string;
  customRule?: any;
}
const props = defineProps<Props>();

const { value, errorMessage } = useField<string>(() => props.name, props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});

const options = ref([{}]);
fetchClients({ nameOrPhone: '' }).then(({ data }) => options.value = data.map(({ name, id }) => ({ label: name, value: id })));

async function filterFn(val: string) {
  const { data } = await fetchClients({ nameOrPhone: val });
  options.value = data.map(({ name, id }) => ({ label: name, value: id }));
}
</script>

<template>
  <QSelect
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :options="options"
    option-value="id"
    option-label="name"
    use-input
    clearable
    dense
    emit-value
    map-options
    outlined
    hide-bottom-space
    :input-debounce="500"
    style="background:white"
    @input-value="filterFn"
  />
</template>
