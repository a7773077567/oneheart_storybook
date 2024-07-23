<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate';
import { ShiftColors } from '@/api/shift';
import type { UpdateUserShift } from '@/api/shift';
import { ShiftType } from '@/const/general';
import { DurationItems } from '@/const/shift';
import { computed } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import { combineTime, splitTime } from '@/utils/date';
import { z } from 'zod';

const props = defineProps<{
  data: any | null;
  shiftTypeOptions: any[];
}>();
const emit = defineEmits<{
  cancel: [state: boolean];
  confirm: [values: UpdateUserShift ];
  close: [];
}>();

const userShiftSchema = z.object({
  type: z.number(),
  name: z.string().trim().min(1, '必填'),
  duration: z.number().array(),
  notAvailableTimes: z.number().array().array().optional(),
  color: z.string(),
  maxClients: z.number({ invalid_type_error: '請輸入數字' }).min(1, '需大於1').nullable(),
  maxClientsForCoachClass: z.number({ invalid_type_error: '請輸入數字' }).min(1, '需大於1').nullable(),
});

const { handleSubmit, values: formValues } = useForm({
  validationSchema: toTypedSchema(userShiftSchema),
  initialValues: {
    ...props.data,
    duration: splitTime(props.data),
    notAvailableTimes: props.data.notAvailableTimes.map(splitTime),
  },
});
const { fields, push, remove } = useFieldArray<number[]>('notAvailableTimes');

const showNotAvailableTimes = computed(() => formValues.type !== ShiftType['物理諮詢門診'] && formValues.type !== ShiftType['團課']);
const showMaxClients = computed(() => formValues.type === ShiftType['物理諮詢門診']);
const showMaxClientsForCoachClass = computed(() => formValues.type === ShiftType['教練課']);

const onSubmit = handleSubmit.withControlled((values) => {
  const { notAvailableTimes } = values;
  const payload = {
    notAvailableTimes: notAvailableTimes ? notAvailableTimes.map(combineTime) : [],
  };

  emit('confirm', payload);
});
</script>

<template>
  <div class="editor">
    <div class="editor__header">
      <span>班表修改</span>
      <QIcon v-close-popup name="close" size="24px" class="editor__close" @click="$emit('close')" />
    </div>
    <div class="editor__body">
      <OSelect name="type" :options="shiftTypeOptions" disable emit-value map-options dense style="width: 230px;" />
      <OInput name="name" disable style="flex: 1 1 0" label="班別名稱" />
      <OInput v-show="showMaxClients" name="maxClients" disable dense outlined label="人數上限" style="width: 100px;" />
      <OInput v-show="showMaxClientsForCoachClass" disable name="maxClientsForCoachClass" label="教練課人數" dense outlined style="width: 100px;" />
      <MultiNumSelect name="duration" :items="DurationItems" disable label="時間" class="gutter" />
      <div v-show="showNotAvailableTimes" class="not-available">
        <div v-for="(field, idx) in fields" :key="field.key" class="not-available__item">
          <MultiNumSelect v-model="field.value" :label="`不可預約時間${idx === 0 ? '' : idx}`" name="notAvailableTimes" :items="DurationItems" class="not-available__select" />
          <QBtn icon="o_delete" flat round class="not-available__delete" @click="remove(idx)" />
        </div>
        <QBtn label="新增不可預約時間" icon="add" dense flat @click="push([0, 0, 0, 0])" />
      </div>
      <ColorPicker name="color" label="班別顏色" disable :colors="ShiftColors" class="gutter" />
    </div>
    <div class="editor__actions">
      <QBtn label="取消" style="width: 126px;" outline @click="$emit('cancel', false)" />
      <QBtn :label="data ? '確定' : '新增'" style="width: 126px;" outline @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor {
  width: 705px;
  max-width: 80vw;
  background-color: #fff;
  &__header {
    position: relative;
    padding: 14px 0;
    text-align: center;
    border-bottom: 1px solid #79747e;
    font-size: 17px;
    font-weight: 700;
  }
  &__close {
    position: absolute;
    top: 50%;
    right: 10px;
    translate: 0 -50%;
    cursor: pointer;
  }
  &__body {
    padding: 20px 20px 0;
  }
  &__actions {
    padding: 0 20px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.not-available {
  margin: 0 -10px 15px;
  padding: 10px;
  border: 1px dashed #aaa;
  border-radius: 15px;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
  }
  &__select {
    flex: 1 1 0;
  }
  &__delete {
    translate: -5px;
  }
}
</style>
