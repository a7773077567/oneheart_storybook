<script setup lang="ts">
// 運動訓練單
import { computed } from "vue";
import dayjs from "dayjs";
import { pick } from "radash";
import type { ClientScheduleDetail, TrainingPlan } from "@/api";
import { useForm } from "vee-validate";

// import { useAppointmentStore } from "@/stores";
import { useQuasar } from "quasar";

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

// const appointmentStore = useAppointmentStore();
const $q = useQuasar();

const recordId = computed(
  () => props.scheduleDetail.medicalAndTrainingRecordId
);
const date = computed(() =>
  dayjs(props.scheduleDetail.date).format("YYYY/MM/DD")
);
const recordField = [
  { name: "action", label: "動作" },
  { name: "weight", label: "重量" },
  { name: "times", label: "次數" },
  { name: "sets", label: "組數/強度" },
  { name: "note", label: "備註" },
  { name: "del", label: "" },
];
const trainingPlanFields = [
  { name: "forMedicalGroup", label: "給治療組的建議" },
  { name: "forFrontDesk", label: "給櫃檯的建議" },
  { name: "forClient", label: "給客戶的建議" },
];

const initialValues = computed<{
  [key in keyof TrainingPlan]: TrainingPlan[key];
}>(() => {
  return pick(props.scheduleDetail.record, [
    "records",
    "forMedicalGroup",
    "forFrontDesk",
    "forClient",
  ]);
});
const { handleSubmit, resetForm, setFieldValue, values, meta } = useForm({
  initialValues: {
    ...initialValues.value,
    ...(initialValues.value.records?.length ?? 0 >= 1
      ? initialValues.value.records
      : { records: [{}, {}, {}] }),
  },
});

const onSubmit = handleSubmit(async (formValue) => {
  console.log(formValue, recordId.value);

  // await updateClientSchedule(recordId.value, formValue);
  $q.notify({ message: "已存檔", timeout: 200 });

  // await appointmentStore.getClientSchedule(props.scheduleId);
  // resetForm({ values: initialValues.value });
});

function addNewSet() {
  setFieldValue("records", [...(values.records ?? []), {}]);
}

function deleteSet(delIdx: number) {
  const newRecords = values.records.filter((record, idx) => idx !== delIdx);
  setFieldValue("records", newRecords);
}
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
      <div>
        <QBtn flat round icon="save" :disable="!meta.dirty" @click="onSubmit" />
      </div>
    </div>
    <div class="form__body">
      <fieldset class="records">
        <div
          v-for="oneSet in recordField"
          :key="oneSet.label"
          class="records__label"
        >
          {{ oneSet.label }}
        </div>
        <template
          v-for="(record, recordIdx) in values.records"
          :key="recordIdx"
        >
          <div
            v-for="(oneSet, idx) in recordField"
            :key="idx"
            class="records__val"
          >
            <QBtn
              v-if="oneSet.name === 'del'"
              flat
              round
              icon="delete"
              @click="deleteSet(recordIdx)"
            />
            <OInput
              v-else
              :name="`records[${recordIdx}]${oneSet.name}`"
              class="records__item"
              hide-bottom-space
            />
          </div>
        </template>
      </fieldset>
      <div>
        <QBtn flat label="新增下一列" icon="o_add" @click="addNewSet" />
      </div>
      <fieldset
        v-for="(item, idx) in trainingPlanFields"
        :key="idx"
        class="input"
      >
        <div class="input__label">
          <span>{{ item.label }}</span>
        </div>
        <OInput
          :name="item.name"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </fieldset>
    </div>
  </div>
</template>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
  }
}

.input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 14px;
  }
}

:deep(textarea) {
  height: 50px;
}

.records {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 50px;
  gap: 12px;
  &__label {
    text-align: center;
  }
}
</style>
