<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ShiftType } from '@/const/general';
import { number, object } from 'zod';
import { type User, getMachineOperatingUsers, updateMachineOperatingUsers } from '@/api';
import { useNotify } from '@/composables/notify';

const props = withDefaults(defineProps<{
  title: string;
  initVal: { userId: number };
  shiftType: ShiftType;
  clientScheduleId: number;
}>(), {
  title: '指派治療師',
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save'): void;
}>();

const operatorList = ref<User[]>([]);
const list = await getMachineOperatingUsers(props.clientScheduleId);
operatorList.value = list;

const initialValues = computed(() => props.initVal);

const schema = computed(() => {
  return object({
    userId: number().min(1, 'user is required'),
  });
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(async (v) => {
  await updateMachineOperatingUsers(props.clientScheduleId, v.userId);
  useNotify('儀器操作人員編輯成功');
  emit('save');
});
</script>

<template>
  <QCard class="machine_operator_form">
    <QCardSection>
      <h2 class="machine_operator_form--title">{{ title }}</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <h3 class="machine_operator_form--subtitle">{{ ShiftType[shiftType] }}儀器治療</h3>
      <form @submit.prevent>
        <OSelect
          name="userId" label="操作人員*" option-value="id" option-label="name" :options="operatorList"
          error-message=""
        />
      </form>
    </QCardSection>
    <QCardActions class="q-pa-lg justify-end">
      <QBtn label="取消" @click="$emit('cancel')" />
      <QBtn label="確定" color="black" @click="onSubmit" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.machine_operator_form {
  width: 336px;
  &--title {
    font-size: 24px;
  }

  &--subtitle {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
  }

  .input-box {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :slotted(.q-field) {
    flex: 1 1 auto;
  }
}
</style>
