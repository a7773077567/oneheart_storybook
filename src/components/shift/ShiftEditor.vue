<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ShiftColors, type ShiftSchema, ShiftTypes, shiftSchema } from '@/api/shift';
import { DurationItems } from '@/const/shift';

interface Props {
  data?: ShiftSchema;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [state: boolean];
  confirm: [values: ShiftSchema];
}>();

const typeOptions = Object.values(ShiftTypes).map((value, index) => ({
  label: value,
  value: index,
}));

const initialValues: ShiftSchema = {
  type: typeOptions[0].value,
  name: '',
  duration: [0, 0, 0, 0],
  unavailable: [[0, 0, 0, 0]],
  color: ShiftColors[0],
};
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(shiftSchema),
  initialValues: props.data || initialValues,
});
const { fields, push, remove } = useFieldArray('unavailable');

const onSubmit = handleSubmit((values) => {
  emit('confirm', values);
});
</script>

<template>
  <QCard style="width: 705px;max-width: 80vw">
    <QCardSection class="row flex-center relative-position q-py-sm ">
      <div class="text-subtitle1 text-weight-bold">
        {{ data ? '班別修改' : '新增班別' }}
      </div>
      <QIcon v-close-popup name="close" size="24px" class="absolute-right cursor-pointer" style="top:50%; translate: -16px -50%;" />
    </QCardSection>
    <QSeparator color="grey-6" />
    <QCardSection>
      <OSelect name="type" :options="typeOptions" label="班別類別" emit-value map-options outlined dense style="width: 230px;" />
      <InputBox label="班別名稱">
        <OInput name="name" outlined dense style="flex: 1 1 0" />
      </InputBox>
      <InputBox label="時間" class="gutter">
        <MultiNumSelect :items="DurationItems" name="duration" style="flex: 1 1 0" />
      </InputBox>
      <InputBox
        v-for="(field, idx) in fields"
        :key="field.key"
        :label="`不可預約時間${idx === 0 ? '' : idx}`"
        class="gutter--sm"
      >
        <MultiNumSelect v-model="field.value" :items="DurationItems" style="flex: 1 1 0" />
        <QBtn icon="o_delete" flat round @click="remove(idx)" />
      </InputBox>
      <QBtn label="新增不可預約時間" icon="add" dense flat class="gutter" @click="push([0, 0, 0, 0])" />
      <InputBox label="班別顏色">
        <ColorPicker :colors="ShiftColors" name="color" style="padding: 6px 14px;" />
      </InputBox>
    </QCardSection>
    <QCardActions align="right">
      <QBtn label="取消" style="width: 126px;" outline @click="$emit('cancel', false)" />
      <QBtn :label="data ? '確定' : '新增'" style="width: 126px;" outline @click="onSubmit" />
    </QCardActions>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
