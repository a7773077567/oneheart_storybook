<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type FormContext, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useOptionStore } from '@/stores';
import { MachineTypes } from '@/const/general';
import { number, object, string } from 'zod';
import { judgeTimeWithinDuration } from '@/utils/date';

interface MachineInfo {
  machineId: number;
  startTime: string;
  endTime: string;
  shockWaveShots?: number;
}

const props = withDefaults(defineProps<{
  title: string;
  initVal: MachineInfo & { scheduleStartTime: string; scheduleEndTime: string } | null;
  machineType: MachineTypes;
}>(), {
  title: '編輯儀器',
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit', value: { value: NonNullable<MachineInfo>; setFieldError: FormContext['setFieldError'] }): void;
}>();

const optionStore = useOptionStore();
const initialValues = computed(() => {
  if (!props.initVal)
    return {
      startTime: '',
      endTime: '',
      scheduleStartTime: '',
      scheduleEndTime: '',
      shockWaveShots: 0,
    };
  return props.initVal;
});

const schema = computed(() => {
  return object({
    machineId: number().min(1, 'machine is required'),
    startTime: string()
      .refine(val => val.length === 5, { message: '請輸入HH:mm格式' })
      .refine(val =>
        judgeTimeWithinDuration({ startTime: val, min: initialValues.value.scheduleStartTime, max: initialValues.value.scheduleEndTime }), { message: '請選擇預約單內的時段' }),
    endTime: string()
      .refine(val => val.length === 5, { message: '請輸入HH:mm格式' })
      .refine(val => judgeTimeWithinDuration({ endTime: val, min: initialValues.value.scheduleStartTime, max: initialValues.value.scheduleEndTime }), { message: '請選擇預約單內的時段' }),
    shockWaveShots: number().optional()
      .refine((val) => {
        if (props.machineType !== MachineTypes['震波儀器治療'])
          return true;
        return (!!val);
      }, { message: 'independentShockWaveShots is required' }),
  }).refine((vals) => {
    return judgeTimeWithinDuration({ startTime: vals.startTime, endTime: vals.endTime, min: initialValues.value.scheduleStartTime, max: initialValues.value.scheduleEndTime });
  }, { message: `請選擇預約單內的時段 ${initialValues.value?.startTime} - ${initialValues.value?.endTime}`, path: ['period'] });
});

const { handleSubmit, setFieldError, errors } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: initialValues.value,
});
const periodNote = computed(() => {
  return 'period' in errors.value ? errors.value.period : `請選擇預約單內的時段 ${props.initVal?.scheduleStartTime} - ${props.initVal?.scheduleEndTime}`;
});

const onSubmit = handleSubmit((v) => {
  emit('submit', { value: v, setFieldError });
});

const machineList = computed(() => optionStore.machineList.filter(machine => machine.type === props.machineType));
</script>

<template>
  <QCard class="device_form">
    <QCardSection>
      <h2 class="device_form--title">{{ title }}</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <h3 class="device_form--subtitle">{{ MachineTypes[machineType] }}儀器治療</h3>
      <form @submit.prevent>
        <OSelect
          name="machineId" label="機台*" option-value="id" option-label="name" :options="machineList"
          error-message=""
        />
        <div class="input-box">
          <OTime name="startTime" now-btn label="開始時間" error-message="" />
          <span style="translate:0 -10px;">至</span>
          <OTime name="endTime" now-btn label="結束時間" error-message="" />
          <span style="translate:0 -10px;">止</span>
        </div>
        <p class="note" :class="{ error: 'period' in errors }">{{ periodNote }}</p>
        <OInput
          v-if="machineType === MachineTypes['震波儀器治療']" name="shockWaveShots" inside-label="發數*"
          type="number"
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
.device_form {
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

  .note {
    padding: 0 16px;
    margin-bottom: 16px;
    font-size: 12px;
    font-weight: 500;
    color: #45464f;
    &.error {
      color: #c2351a;
    }
  }
}
</style>
