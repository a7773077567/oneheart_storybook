<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate';
import { ShiftColors } from '@/api/shift';
import type { Duration, ShiftTemplate, ShiftTemplateReq, UserShift, UserShiftPatch } from '@/api/shift';
import { ShiftType, SportTherapyTypes, TherapyTypes, Types } from '@/const/general';
import { DurationItems } from '@/const/shift';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import { computed, watch } from 'vue';
import { omit } from 'radash';
import { useUserStore } from '@/stores';

interface Props {
  data?: any | null;
  userShiftMode?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [state: boolean];
  confirm: [values: any ];
  updateConfirm: [values: UserShiftPatch];
}>();

dayjs.extend(objectSupport);
const userStore = useUserStore();
const isGym = computed(() => userStore.currentSpaceType === 2);
const shiftTypeOptions = Object.values(Types).map(({ label, identifier }) => {
  return { label, value: identifier };
});
const typeOptions = computed(() => isGym.value ? shiftTypeOptions.slice(8, 10) : shiftTypeOptions.slice(0, 8));

const { handleSubmit, values, setFieldValue } = useForm({
  // validationSchema: toTypedSchema(shiftTemplateSchema),
  initialValues: getInitialValues(),
});
const showNotAvailableTimes = computed(() => values.type !== 1);
const showMaxClients = computed(() => values.type === 1);
const showMaxClientsForCoachClass = computed(() => values.type === 9);
const { fields, push, remove } = useFieldArray<number[]>('notAvailableTimes');
watch(showNotAvailableTimes, (newVal) => {
  if (!newVal) {
    setFieldValue('notAvailableTimes', []);
  }
});

const onSubmit = handleSubmit((values) => {
  const { duration, notAvailableTimes, maxClients, maxClientsForCoachClass, ...needed } = omit(values, ['id', 'spaceId']);
  if (!props.userShiftMode) {
    const payload = {
      ...needed,
      ...combineTime(duration),
      notAvailableTimes: notAvailableTimes.map(combineTime),
      maxClients: maxClients ? +maxClients : null,
      maxClientsForCoachClass: maxClientsForCoachClass ? +maxClientsForCoachClass : null,
    };

    emit('confirm', payload);
  }
  else {
    const payload: UserShiftPatch = {
      notAvailableTimes: notAvailableTimes.map(combineTime),
    };

    emit('updateConfirm', payload);
  }
});

function getInitialValues() {
  return props.data ? createInitials(props.data) : createDefault();

  function createDefault() {
    return {
      type: typeOptions.value[0].value,
      name: '',
      duration: [0, 0, 0, 0],
      notAvailableTimes: [],
      color: ShiftColors[0],
      maxClients: '',
    };
  }

  function createInitials(data: UserShift) {
    return {
      ...data,
      duration: splitTime(data),
      notAvailableTimes: data.notAvailableTimes.map(splitTime),
      maxClients: data.maxClients ? data.maxClients.toString() : '',
    };
  }
}

// HH:mm & HH:mm -> [H, m, H, m]
function splitTime(duration: Duration) {
  const { startTime, endTime } = duration;
  const timeArray = [...startTime.split(':'), ...endTime.split(':')];
  return timeArray.map(time => +time);
}

// [H,m, H, m] -> HH:mm & HH:mm
function combineTime(duration: number[]): Duration {
  const startTime = dayjs({ h: duration[0], m: duration[1] });
  const endTime = dayjs({ h: duration[2], m: duration[3] });
  return {
    startTime: startTime.format('HH:mm'),
    endTime: endTime.format('HH:mm'),
  };
}
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
      <OSelect name="type" :options="typeOptions" label="班別類別" emit-value map-options outlined dense :disable="userShiftMode" style="width: 230px;" />
      <InputBox label="班別名稱">
        <OInput name="name" :disable="userShiftMode" style="flex: 1 1 0" />
      </InputBox>
      <InputBox label="時間" class="gutter">
        <MultiNumSelect :items="DurationItems" name="duration" :disable="userShiftMode" style="flex: 1 1 0" />
      </InputBox>
      <template v-if="showNotAvailableTimes">
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
      </template>
      <InputBox label="班別顏色" class="gutter">
        <ColorPicker :colors="ShiftColors" name="color" :disable="userShiftMode" style="padding: 6px 14px;" />
      </InputBox>
      <InputBox v-if="showMaxClients" label="最多可預約人數">
        <OInput name="maxClients" dense outlined :disable="userShiftMode" style="flex: 0 1 100px" />
      </InputBox>
      <InputBox v-if="showMaxClientsForCoachClass" label="教練課人數">
        <OInput name="maxClientsForCoachClass" dense outlined :disable="userShiftMode" style="flex: 0 1 100px" />
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
