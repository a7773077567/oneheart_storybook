<script setup lang='ts' generic="T extends 'add' | 'edit'">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { createTrainingAllowance, updateTrainingAllowance } from '@/api';
import { computed, ref } from 'vue';
import { RoleType } from '@/api/user';
import dayjs from 'dayjs';

const props = defineProps<{
  type: T;
  initVals?: T extends 'edit' ? Partial<FormTypes> : null;
  role: RoleType;
  therapistOptions: { label: string; value: number }[];
  bonusId?: T extends 'edit' ? number : undefined;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create'): void;
}>();

const schema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  reviewDate: z.string(),
  reviewTime: z.string(),
  amount: z.number(),
});

type FormTypes = typeof schema & { reviewScreenshot?: string | undefined };

const initialValues = computed(() => {
  if (props.type === 'edit')
    return props.initVals;

  return {
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewTime: dayjs().format('HH:mm'),
    userId: props.role === RoleType['物理治療師'] ? props.therapistOptions[0].value : undefined,
    amount: 600, // 金額預設 600
  };
});

const { handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: initialValues.value,
});

const isLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    if (props.type === 'edit' && !!props.bonusId) {
      await updateTrainingAllowance(props.bonusId, {
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
        amount: values.amount,
      });
    }
    else {
      await createTrainingAllowance({
        reviewDateTime: dayjs(`${values.reviewDate} ${values.reviewTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        userId: values.userId,
        title: values.title,
        amount: values.amount,
      });
    }
    isLoading.value = false;
    emit('create');
  }
  catch (error) {
    console.error('Error during submission:', error);
  }
});
</script>

<template>
  <QCard class="form">
    <QCardSection class="q-pa-lg">
      <h2 class="text-headline-small">{{ type === 'add' ? '上傳培訓津貼' : '編輯培訓津貼' }}</h2>
    </QCardSection>
    <QCardSection class="q-pa-lg">
      <form>
        <OSelect name="userId" label="治療師*" error-message="" :options="therapistOptions" />
        <OInput name="title" inside-label="項目名稱*" error-message="" />
        <OInput name="amount" inside-label="金額*" type="number" error-message="" />
        <OInput date-mode name="reviewDate" inside-label="上傳日期*" mask="date" :rules="['date']" error-message="" />
        <OTime name="reviewTime" now-btn label="上傳時間" error-message="" />
      </form>
    </QCardSection>
    <QCardSection class="q-pa-lg row justify-end">
      <QBtn flat rounded label="取消" class="q-mr-sm" @click="$emit('close')" />
      <QBtn :disable="!meta.valid" rounded color="primary" label="確定" :loading="isLoading" @click="onSubmit" />
    </QCardSection>
  </QCard>
</template>

<style scoped lang="scss">
.form {
  min-width: 480px;
}
</style>
