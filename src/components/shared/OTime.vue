<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
  modelValue?: string;
  name?: string;
}
const props = defineProps<Props>();

const { value: fieldValue, errorMessage } = useField<string>(() => props.name || 'field', undefined, {
  syncVModel: true,
});
</script>

<template>
  <QInput v-model="fieldValue" mask="time" :error="!!errorMessage" :rules="['time']" dense :error-message="errorMessage" outlined>
    <template #append>
      <QIcon name="access_time" class="cursor-pointer">
        <QPopupProxy cover transition-show="scale" transition-hide="scale">
          <QTime
            v-model="fieldValue"
            format24h
            now-btn
          >
            <div class="row items-center justify-end">
              <QBtn v-close-popup label="Close" color="primary" flat />
            </div>
          </QTime>
        </QPopupProxy>
      </QIcon>
    </template>
  </QInput>
</template>

<style lang="scss" scoped>

</style>
