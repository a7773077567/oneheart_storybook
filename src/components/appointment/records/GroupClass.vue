<script setup lang="ts">
// 團課單
import { computed } from "vue";
import dayjs from "dayjs";
import type { ClientScheduleDetail } from "@/api";
import { useForm } from "vee-validate";

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const date = computed(() =>
  dayjs(props.scheduleDetail.date).format("YYYY/MM/DD")
);

const initialValues = computed(() => {
  return { note: props.scheduleDetail.record.note };
});
const { handleSubmit, meta } = useForm({
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit((val) => {
  console.log(val);
});
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div class="input">
        <div class="input__label">
          <span>備註</span>
        </div>
        <OInput
          name="note"
          type="textarea"
          class="input__item"
          hide-bottom-space
        />
      </div>
    </div>
    <div class="flex justify-end">
      <QBtn
        label="儲存"
        style="width: 100px"
        :disable="!meta.dirty"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
</style>
