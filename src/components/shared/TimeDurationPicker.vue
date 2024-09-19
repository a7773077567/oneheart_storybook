<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';
import { QTime } from 'quasar';

interface Duration {
  start: string;
  end: string;
}

type Options = InstanceType<typeof QTime>['$props']['options'];
const props = defineProps<{
  modelValue: Duration;
  options?: Options;
}>();

const emit = defineEmits<{
  'update:modelValue': [duration: Duration];
  cancel: [];
}>();

const model = ref({ ...props.modelValue });
const canSave = computed(() => {
  const [startHr, startMin] = model.value.start.split(':');
  const [endHr, endMin] = model.value.end.split(':');
  const start = dayjs().hour(+startHr).minute(+startMin);
  const end = dayjs().hour(+endHr).minute(+endMin);

  return end > start;
});

watch(() => props.modelValue, newVal => model.value = newVal);

function cancel() {
  model.value = props.modelValue;
  emit('cancel');
}

function save() {
  emit('update:modelValue', model.value);
}
</script>

<template>
  <div class="time-duration-picker">
    <div class="time-duration-picker__body">
      <QInput v-model="model.start" mask="time" readonly label="開始" outlined>
        <template #append>
          <QIcon name="access_time" class="cursor-pointer">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QTime v-model="model.start" :options="options" format24h>
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Close" color="primary" flat />
                </div>
              </QTime>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
      <span>至</span>
      <QInput v-model="model.end" mask="time" label="結束" outlined readonly>
        <template #append>
          <QIcon name="access_time" class="cursor-pointer">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QTime v-model="model.end" :options="options" format24h>
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Close" color="primary" flat />
                </div>
              </QTime>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
      <span>止</span>
    </div>
    <div class="time-duration-picker__actions">
      <QBtn label="取消" outline @click="cancel" />
      <QBtn label="儲存" :outline="!canSave" color="black" :disable="!canSave" @click="save" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.time-duration-picker {
  display: flex;
  gap: 10px;
  align-items: center;
  &__body {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__actions {
    display: flex;
    gap: 10px;
  }
}

:deep(.q-field--outlined.q-field--readonly .q-field__control:before) {
  border-style: solid;
}
</style>
