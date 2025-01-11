<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { availableReqSchema } from '@/api/appointment';
import { ShiftType } from '@/const/general';
import { object, string } from 'zod';

interface MachineDetail {
  machine: string;
  startTime: string;
  endTime: string;
  independentShockWaveShots?: number;
}

const props = withDefaults(defineProps<{
  title: string;
  value: MachineDetail;
  shiftType: ShiftType;
}>(), {
  title: '編輯儀器',
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', value: any): void;
}>();

const schema = computed(() => {
  const basic = object({
    machine: string().min(1, 'machine is required'),
    startTime: string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
    endTime: string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
  });
  return props.shiftType === ShiftType['射頻']
    ? basic.extend({
      independentShockWaveShots: string().min(1, 'independentShockWaveShots is required'),
    })
    : basic;
});
const initVal = computed(() => props.value);
const periodNote = ref(`請選擇預約單內的時段 ${props.value.startTime} ${props.value.endTime}`);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: initVal.value,
});

const onSubmit = handleSubmit((v) => {
  console.log(v);
  emit('save', v);
});
</script>

<template>
  <QCard class="device_form">
    <QCardSection>
      <h2 class="device_form--title">{{ title }}</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <h3 class="device_form--subtitle">{{ ShiftType[shiftType] }}儀器治療</h3>
      <form @submit.prevent>
        <OSelect name="machine" label="機台*" :options="[]" error-message="" />
        <div class="input-box">
          <OTime name="startTime" now-btn label="開始時間" error-message="" />
          <span style="translate:0 -10px;">至</span>
          <OTime name="endTime" now-btn label="結束時間" error-message="" />
          <span style="translate:0 -10px;">止</span>
        </div>
        <p class="note">{{ periodNote }}</p>
        <OInput v-if="shiftType === ShiftType['射頻']" name="independentShockWaveShots" inside-label="發數*" error-message="" />
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
  }
}
</style>
