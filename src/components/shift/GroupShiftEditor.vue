<script setup lang="ts">
import { MultiNumSelect } from '@/components/shared';
import { DurationItems } from '@/const/shift';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { omit } from 'radash';

interface ConfirmValues {
  numberOfClasses: number;
  maxClientsForGroupClass: number;
  name: string;
  startTime: string;
  endTime: string;
}

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', values: ConfirmValues): void;
}>();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(z.object({
    numberOfClasses: z.number({ invalid_type_error: '請輸入數字' }).min(1, '需大於1'),
    maxClientsForGroupClass: z.number({ invalid_type_error: '請輸入數字' }).min(1, '需大於1'),
    name: z.string().trim().min(1, '必填'),
    duration: z.number().array(),
  })),
  initialValues: {
    numberOfClasses: 0,
    maxClientsForGroupClass: 0,
    name: '',
    duration: [0, 0, 0, 0],
  },
});

const onConfirm = handleSubmit((values) => {
  const { duration: [startHr, startMin, endHr, endMin] } = values;
  emit('confirm', omit({
    ...values,
    startTime: toTimeString(startHr, startMin),
    endTime: toTimeString(endHr, endMin),
  }, ['duration']));
});

function toTimeString(start: number, end: number) {
  return `${start.toString().padStart(2, '0')}:${end.toString().padStart(2, '0')}`;
}
</script>

<template>
  <QCard style="width: 705px;max-width: 80vw">
    <QCardSection class="row flex-center relative-position q-py-sm ">
      <div class="text-subtitle1 text-weight-bold">
        新增團課
      </div>
      <QIcon v-close-popup name="close" size="24px" class="absolute-right cursor-pointer" style="top:50%; translate: -16px -50%;" />
    </QCardSection>
    <QSeparator color="grey-6" />
    <QCardSection>
      <InputBox label="堂數" style="width: 100px;">
        <OInput name="numberOfClasses" type="number" />
      </InputBox>
      <InputBox label="人數上限" style="width: 100px;">
        <OInput name="maxClientsForGroupClass" type="number" />
      </InputBox>
      <InputBox label="團課名稱">
        <OInput name="name" />
      </InputBox>
      <InputBox label="時間" class="gutter">
        <MultiNumSelect name="duration" :items="DurationItems" style="flex: 1 1 0" />
      </InputBox>
    </QCardSection>
    <QCardActions align="right">
      <QBtn label="取消" style="width: 126px;" outline @click="$emit('cancel')" />
      <QBtn label="新增" style="width: 126px;" outline @click="onConfirm" />
    </QCardActions>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
