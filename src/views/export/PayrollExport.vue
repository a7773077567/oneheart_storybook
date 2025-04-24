<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type SalaryReportParams, exportSalaryReport, fetchSpaces } from '@/api';
import dayjs from 'dayjs';

const spaceOptions = ref<{ label: string; value: number }[]>([]);
await fetchSpaces().then(res => spaceOptions.value = res.map(space => ({ label: space.name, value: space.id })));

const form = ref<SalaryReportParams>({
  yearMonth: '',
  spaceIds: [],
});

const ifDisabled = computed(() => Object.values(form.value).some(field => !field));
const isDownloading = ref(false);
async function submit() {
  if (ifDisabled.value)
    return;
  isDownloading.value = true;
  await exportSalaryReport({
    yearMonth: dayjs(form.value.yearMonth).format('YYYY/MM'),
    spaceIds: form.value.spaceIds,
  });
  isDownloading.value = false;
}
</script>

<template>
  <div class="row q-col-gutter-md">
    <fieldset class="col-9">
      <QInput
        v-model="form.yearMonth"
        label="選擇日期"
        dense
        emit-value
        map-options
        outlined
        date-mode
      >
        <template #append>
          <QIcon name="o_calendar_month" size="28px" class="cursor-pointer">
            <QPopupProxy cover transition-show="scale" transition-hide="scale">
              <QDate v-model="form.yearMonth" mask="YYYY-MM-DD" today-btn>
                <div class="row items-center justify-end">
                  <QBtn v-close-popup label="Close" color="primary" flat />
                </div>
              </QDate>
            </QPopupProxy>
          </QIcon>
        </template>
      </QInput>
    </fieldset>
    <fieldset class="col-9">
      <QSelect
        v-model="form.spaceIds"
        label="選擇場館（可複選）"
        :options="spaceOptions"
        dense
        emit-value
        map-options
        outlined
      />
    </fieldset>
    <div class="col-12 q-mt-md">
      <QBtn color="primary" rounded label="匯出報表" :loading="isDownloading" :disabled="ifDisabled" @click="submit" />
    </div>
  </div>
</template>
