<script setup lang='ts'>
import { ref, watch } from 'vue';
import { QIcon } from 'quasar';
import { removeZhuyin } from '@/utils/helpers';

interface Props {
  modelValue?: string;
  debounce?: number;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  debounce: 1000,
  placeholder: '搜尋客戶姓名或手機號碼',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
  (e: 'clear'): void;
}>();

const inputValue = ref(props.modelValue || '');
const isFocused = ref(false);
let debounceTimer: NodeJS.Timeout | null = null;

function handleClear() {
  inputValue.value = '';
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  emit('update:modelValue', '');
  emit('clear');
}

function handleFocus() {
  isFocused.value = true;
}

function handleBlur() {
  isFocused.value = false;
}
const isComposing = ref(false);

function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd() {
  isComposing.value = false;
  const cleanedValue = removeZhuyin(inputValue.value);
  emit('update:modelValue', cleanedValue);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    emit('search', cleanedValue);
  }, props.debounce);
}

watch(inputValue, (newValue) => {
  if (isComposing.value)
    return;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const cleanedValue = removeZhuyin(newValue);

  emit('update:modelValue', cleanedValue);

  debounceTimer = setTimeout(() => {
    emit('search', cleanedValue);
  }, props.debounce);
});
</script>

<template>
  <div class="osearch">
    <div class="osearch__wrapper" :class="{ 'osearch__wrapper--filled': inputValue || isFocused }">
      <label class="osearch__label" :class="{ 'osearch__label--float': inputValue || isFocused }">
        {{ placeholder }}
      </label>
      <input
        v-model="inputValue"
        class="osearch__input"
        @focus="handleFocus"
        @blur="handleBlur"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      >
      <div class="osearch__append">
        <QIcon
          v-if="inputValue"
          name="close"
          class="osearch__clear"
          @click="handleClear"
        />
        <QIcon name="search" class="osearch__search" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.osearch {
  width: 280px;

  &__wrapper {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 8px;
    background: white;
    transition: border-color 0.15s ease-in-out;

    &:focus-within {
      .osearch__label {
        @include text-style($body-small, $on-surface-variant);
      }
    }

    &:hover {
      border-color: rgba(0, 0, 0, 0.54);
    }

    &--filled {
      .osearch__label {
        transform: translateY(-20px) scale(0.75);
        @include text-style($body-small, $on-surface);
      }
    }
  }

  &__label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    line-height: 1;
    pointer-events: none;
    transition: all 0.2s ease-out;
    background: white;
    padding: 0 4px;
    transform-origin: left top;

    @include text-style($body-large, $on-surface-variant);

    &--float {
      transform: translateY(-20px) scale(0.75);
      @include text-style($body-small, $on-surface-variant);
    }
  }

  &__input {
    width: 100%;
    border: none;
    outline: none;
    padding: 16px 60px 8px 16px;
    font-size: 16px;
    line-height: 1.5;
    background: transparent;
    color: rgba(0, 0, 0, 0.87);

    &:focus {
      outline: none;
    }
  }

  &__append {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__clear {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;

    &:hover {
      color: rgba(0, 0, 0, 0.87);
    }
  }

  &__search {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.54);
  }
}
</style>
