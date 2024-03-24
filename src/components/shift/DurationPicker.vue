<script setup lang="ts">
import { computed } from 'vue';

interface Duration {
  startDate: string;
  endDate: string;

}
interface Props {
  modelValue: Duration;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: Duration];
}>();

const start = computed({
  get: () => props.modelValue.startDate,
  set: val => emit('update:modelValue', { ...props.modelValue, startDate: val }),
});
const end = computed({
  get: () => props.modelValue.endDate,
  set: val => emit('update:modelValue', { ...props.modelValue, endDate: val }),
});
</script>

<template>
  <div class="row items-center q-gutter-sm">
    <span>日期</span>
    <QInput v-model="start" dense outlined hide-bottom-space no-error-icon mask="date" :rules="['date']">
      <template #append>
        <QIcon name="event" class="cursor-pointer">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate v-model="start">
              <div class="row items-center justify-end">
                <QBtn v-close-popup label="Close" color="primary" flat />
              </div>
            </QDate>
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
    <span>至</span>
    <QInput v-model="end" dense outlined hide-bottom-space no-error-icon mask="date" :rules="['date']">
      <template #append>
        <QIcon name="event" class="cursor-pointer">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate v-model="end">
              <div class="row items-center justify-end">
                <QBtn v-close-popup label="Close" color="primary" flat />
              </div>
            </QDate>
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
    <span>止</span>
  </div>
</template>

<style lang="scss" scoped>

</style>
