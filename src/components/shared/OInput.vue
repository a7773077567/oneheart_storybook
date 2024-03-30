<script setup lang="ts">
import { useField } from 'vee-validate';
import type { QInputProps } from 'quasar';
import type { Optional } from '@/types/utilities';

interface Props extends /* @vue-ignore */ Optional<QInputProps, 'modelValue'> {
  name?: string;
  customRule?: any;
  dateMode?: boolean;
}
const props = defineProps<Props>();

const { value, errorMessage } = useField<string>(() => props.name || '', props.customRule, {
  syncVModel: true, // Skipping update:modelValue emission definition by setting this config
});
</script>

<template>
  <QInput
    v-model="value"
    :error="!!errorMessage"
    :error-message="errorMessage"
    dense
    outlined
  >
    <template #append>
      <QIcon v-if="dateMode" name="o_calendar_month" size="28px" class="cursor-pointer">
        <QPopupProxy cover transition-show="scale" transition-hide="scale">
          <QDate v-model="value" mask="YYYY-MM-DD" today-btn>
            <div class="row items-center justify-end">
              <QBtn v-close-popup label="Close" color="primary" flat />
            </div>
          </QDate>
        </QPopupProxy>
      </QIcon>
      <slot v-else name="append" />
    </template>
  </QInput>
</template>

<style lang="scss" scoped>

</style>
