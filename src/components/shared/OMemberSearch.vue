<script setup lang="ts">
import { computed, ref } from 'vue';
import { useField } from 'vee-validate';
import type { QSelectProps } from 'quasar';
import type { Optional } from '@/types/utilities';
import { type Client, fetchClients } from '@/api';

interface Props extends /* @vue-ignore */ Optional<QSelectProps, 'modelValue'> {
  name?: string;
  customRule?: any;
  placeholder?: string;
}
const props = defineProps<Props>();

defineEmits<{
  (e: 'fullInfo', val: Client | null): void;
}>();

const { value, errorMessage } = useField<number>(() => props?.name ?? '', props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});

const options = ref<Client[]>([]);
fetchClients({ nameOrPhone: '' }).then(({ data }) => options.value = data.map(({ name, id, phone, ...others }) => ({ name: `${name} (會員編號#${id}) - ${phone}`, id, phone, ...others })));

async function filterFn(val: string) {
  const { data } = await fetchClients({ nameOrPhone: val });
  options.value = data.map(({ name, id, ...others }) => ({ name: `${name} (會員編號#${id})`, id, ...others }));
}

const fullInfo = computed(() => {
  if (!value)
    return null;
  return options.value.find(o => o.id === value.value) ?? null;
});
</script>

<template>
  <QSelect
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :options="options"
    :placeholder="value ? '' : placeholder"
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
    @update:model-value="$emit('fullInfo', fullInfo)"
  />
</template>
