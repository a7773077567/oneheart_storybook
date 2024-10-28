<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import { useField } from 'vee-validate';

interface MultiRange { from: string; to: string };

interface Props {
  modelValue?: string;
  name?: string;
  range?: boolean;
  options?: string[] | ((date: any) => boolean);
}

const props = defineProps<Props>();

const { value: fieldValue } = useField<MultiRange | string>(() => props.name || '', undefined, {
  syncVModel: true,
});

const currentDate = computed<string>(() => {
  if (props.range && fieldValue.value && ('from' in (fieldValue.value as object)) && 'to' in (fieldValue.value as object))
    return `${dayjs((fieldValue.value as MultiRange)?.from).format('YYYY年M月D日') ?? dayjs()} - ${dayjs((fieldValue.value as MultiRange)?.to ?? dayjs()).format('YYYY年M月D日')}`;

  return fieldValue.value ? dayjs(fieldValue.value as string).locale('zh-tw').format('YYYY年M月D日 ddd') : '';
});
</script>

<template>
  <div class="date-picker">
    <span class="date-picker__label">{{ currentDate }}</span>
    <QIcon name="o_calendar_month" size="28px" class="cursor-pointer">
      <QPopupProxy cover transition-show="scale" transition-hide="scale">
        <QDate v-model="fieldValue" mask="YYYY-MM-DD" today-btn :range="range" :options="options">
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
    min-width: 131px;
    font-size: 19px;
  }
}
</style>
