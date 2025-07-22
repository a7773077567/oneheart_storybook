<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { QSelect } from 'quasar';
import type { QSelectProps, QSelectSlots } from 'quasar';
import type { Optional } from '@/types/utilities';
import { type Client, fetchClients } from '@/api';
import { removeZhuyin } from '@/utils/helpers';

// interface Props extends /* @vue-ignore */ Optional<QSelectProps, 'modelValue'> {
//   name?: string;
//   customRule?: any;
//   placeholder?: string;
//   addValue?: boolean;
// }
const props = defineProps<
  Partial<Pick<QSelectProps, 'modelValue'>>
  & Omit<QSelectProps, 'modelValue'>
  & {
    name?: string;
    customRule?: any;
    placeholder?: string;
    addValue?: boolean;
  }
>();

const emit = defineEmits<{
  (e: 'update:fullInfo', val: Client | null): void;
  (e: 'addValue', val: { name: string | null; phone: string | null }): void;
  (e: 'clear', val: null): void;
}>();

const select = ref(null);
const { value, errorMessage } = useField<number>(() => props?.name ?? '', props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
  initialValue: props.modelValue,
});

type Option = Client & { label: string };
const options = ref<Option[]>([]);
options.value = (await fetchClients({ nameOrPhone: '' })).data.map(({ name, id, phone, ...others }) => ({ label: `${name} (會員編號#${id}) - ${phone}`, id, phone, name, ...others }));

const customValue = ref('');

function isValidTaiwanMobileNumber(input: string) {
  const taiwanMobileRegex = /^09\d{8}$/;
  return taiwanMobileRegex.test(input) && /^\d+$/.test(input);
}
const isValidValue = computed(() => {
  const startsWith09Regex = /^09/;
  if (customValue.value && !startsWith09Regex.test(customValue.value))
    return true;

  return isValidTaiwanMobileNumber(customValue.value);
});

async function filterFn(val: string) {
  const validValue = removeZhuyin(val);
  if (val && select.value) {
    customValue!.value = validValue;
  }
  const { data } = await fetchClients({ ...(!!val && { nameOrPhone: val }) });
  options.value = data.map(({ name, id, phone, ...others }) => ({ label: `${name} (會員編號#${id}) - ${phone}`, id, phone, name, ...others }));
}

// const fullInfo = computed(() => {
//   if (!value)
//     return null;
//   return options.value.find(o => o.id === value.value) ?? null;
// });

watch(value, (newVal) => {
  if (!newVal) {
    return null;
  }
  emit('update:fullInfo', options.value.find(o => o.id === newVal) ?? null);
}, { immediate: true });

// function handleUpdate(v: null | typeof value) {
//   if (v) {
//     emit('update:fullInfo', fullInfo.value);
//   }
// }

function addNewValue() {
  if (!isValidValue.value)
    return;

  const isPhoneNumber = isValidTaiwanMobileNumber(customValue.value);
  emit('addValue', isPhoneNumber ? { name: null, phone: customValue.value } : { name: customValue.value, phone: null });

  if (select.value) {
    (select.value as QSelect).hidePopup();
  }
}

function removeValue() {
  emit('clear', null);
}
</script>

<template>
  <QSelect
    ref="select"
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :options="options"
    :placeholder="value ? '' : placeholder"
    option-value="id"
    option-label="label"
    use-input
    clearable
    dense
    emit-value
    map-options
    outlined
    hide-bottom-space
    :input-debounce="500"
    style="background:white"
    v-bind="{ 'label-slot': !!label }"
    @input-value="filterFn"
    @clear="removeValue"
  >
    <!-- @update:model-value="handleUpdate" -->
    <template v-if="addValue" #after-options>
      <QItem class="items-center" :disable="!isValidValue" clickable @click="addNewValue">
        + 新增 {{ customValue }}
      </QItem>
    </template>
    <template v-if="addValue" #no-option>
      <QItem class="items-center" :disable="!isValidValue" clickable @click="addNewValue">
        + 新增 {{ customValue }}
      </QItem>
    </template>
    <template v-if="label" #label>
      {{ label }}
    </template>

    <template v-for="(_, slotname) in ($slots as Readonly<QSelectSlots>)" #[slotname]>
      <slot :name="slotname" />
    </template>
  </QSelect>
</template>
