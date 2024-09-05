<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { useQuasar } from 'quasar';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { type ClientScheduleDetail, updateClientSchedule } from '@/api/appointment';
import dayjs from 'dayjs';
import { pick } from 'radash';
import { extractUuidFromS3Url } from '@/utils/helpers';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const appointmentStore = useAppointmentStore();
const $q = useQuasar();
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const date = computed(() => dayjs(props.scheduleDetail.date).format('YYYY/MM/DD'));

const staticAttachments = ref([]);
const dynamicAttachments = ref([]);

const initialValues = computed(() => pick(props.scheduleDetail.record, ['staticPressureAttachments', 'dynamicPressureAttachments', 'note']));
const { handleSubmit, values, resetForm } = useForm({ initialValues: initialValues.value });
const staticDisplayAttachments = computed(() => values.staticPressureAttachments?.map((attUrl, idx) => ({ name: `staticPressureAttachments[${idx}]`, url: attUrl }))?.filter(file => !!file.url));
const dynamicDisplayAttachments = computed(() => values.dynamicPressureAttachments?.map((attUrl, idx) => ({ name: `dynamicPressureAttachments[${idx}]`, url: attUrl }))?.filter(file => !!file.url));

const onSubmit = handleSubmit(async (formValue) => {
  let staticFileUUIDs: string[] = [];
  let dynamicFileUUIDs: string[] = [];

  if (staticAttachments.value.length > 0) {
    staticFileUUIDs = await Promise.all(staticAttachments.value.map(file =>
      appointmentStore.uploadAttachments(recordId.value, file),
    ));
  }
  if (dynamicAttachments.value.length > 0) {
    dynamicFileUUIDs = await Promise.all(dynamicAttachments.value.map(file =>
      appointmentStore.uploadAttachments(recordId.value, file),
    ));
  }
  await updateClientSchedule(recordId.value, {
    ...formValue,
    staticPressureAttachments: [...formValue.staticPressureAttachments ?? [], ...staticFileUUIDs].map(s3Url => extractUuidFromS3Url(s3Url)).filter(file => file) as string[],
    dynamicPressureAttachments: [...formValue.dynamicPressureAttachments ?? [], ...dynamicFileUUIDs].map(s3Url => extractUuidFromS3Url(s3Url)).filter(file => file) as string[],
  });
  $q.notify({ message: '已存檔', timeout: 200 });

  await appointmentStore.getClientSchedule(props.scheduleId);
  resetForm({ values: initialValues.value });
});
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>{{ date }}</div>
    </div>
    <div class="form__body">
      <div class="row q-gutter-xl">
        <div class="column q-gutter-md">
          <OFile v-model="staticAttachments" label="靜態足壓檔案" multiple />
          <div class="preview_files">
            <OPreview
              v-for="(attachment, idx) in staticDisplayAttachments" :key="attachment.name"
              :name="attachment.name"
              :label="`附件資料 ${idx + 1}`"
            />
          </div>
        </div>
        <div class="column q-gutter-md">
          <OFile v-model="dynamicAttachments" label="動態足壓檔案" multiple />
          <div class="preview_files">
            <OPreview
              v-for="(attachment, idx) in dynamicDisplayAttachments" :key="attachment.name"
              :name="attachment.name"
              :label="`附件資料 ${idx + 1}`"
            />
          </div>
        </div>
      </div>
      <InputBox label="備註" label-weight="400">
        <OInput name="note" type="textarea" />
      </InputBox>
    </div>
    <div class="form__actions">
      <QBtn label="儲存" style="width: 100px" @click="onSubmit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
</style>
