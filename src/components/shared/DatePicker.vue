<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [model: string];
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
const currentDate = computed(() => dayjs(model.value).format('YYYY年M月D日'));
</script>

<template>
  <div class="date-picker">
    <span class="date-picker__label">{{ currentDate }}</span>
    <QIcon name="o_calendar_month" size="28px" class="cursor-pointer">
      <QPopupProxy cover transition-show="scale" transition-hide="scale">
        <QDate v-model="model" mask="YYYY-MM-DD">
          <div class="row items-center justify-end">
            <QBtn v-close-popup label="Close" color="primary" flat />
          </div>
        </QDate>
      </QPopupProxy>
    </QIcon>
  </div>
</template>

<style lang="scss" scoped>
.date-picker {
  width: 356px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #f5f5f5;
  border-radius: 20px;
  &__label {
    font-size: 19px;
  }
}
</style>
