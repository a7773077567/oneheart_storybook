<script setup lang="ts">
import { ref } from 'vue';
import { MultiNumSelect } from '@/components/shared';
import { DurationItems } from '@/const/shift';

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

const totalSessions = ref<number>(0);
const macClients = ref<number>(0);
const name = ref('');
const duration = ref<number[]>([]);

function onConfirm() {
  emit('confirm', {
    numberOfClasses: +totalSessions.value,
    maxClientsForGroupClass: +macClients.value,
    name: name.value,
    startTime: toTimeString(duration.value[0], duration.value[1]),
    endTime: toTimeString(duration.value[2], duration.value[3]),
  });
}

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
        <OInput v-model="totalSessions" type="number" />
      </InputBox>
      <InputBox label="人數上限" style="width: 100px;">
        <OInput v-model="macClients" type="number" />
      </InputBox>
      <InputBox label="團課名稱">
        <OInput v-model="name" />
      </InputBox>
      <InputBox label="時間" class="gutter">
        <MultiNumSelect v-model="duration" :items="DurationItems" style="flex: 1 1 0" />
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
