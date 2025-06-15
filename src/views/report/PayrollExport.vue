<script setup lang='ts'>
import { computed, ref } from 'vue';
import { type SalaryReportParams, exportSalaryReport, fetchSpaces } from '@/api';
import dayjs from 'dayjs';
import { useOptionStore } from '@/stores';

const optionStore = useOptionStore();
const spaceOptions = computed<{ label: string; value: number }[]>(() => optionStore.spaceList.map(space => ({ label: space.name, value: space.id })));

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
  try {
    await exportSalaryReport({
      yearMonth: dayjs(form.value.yearMonth).format('YYYY/MM'),
      spaceIds: form.value.spaceIds,
    });
  }
  catch (error) {
    console.log(error);
  }
  finally {
    isDownloading.value = false;
  }
}

const showCalendar = ref(false);
function selectMonth({ year, month }: { year: number; month: number }) {
  if (!year && !month)
    return;
  form.value.yearMonth = `${year}/${month}`;
  showCalendar.value = false;
}

function handleClick(e: MouseEvent) {
  if ((e?.target as HTMLElement)?.innerHTML?.includes('月'))
    showCalendar.value = false;
}

const errorRange = computed(() => dayjs(form.value.yearMonth).isSameOrAfter(undefined, 'month'));
const disableSubmit = computed(() => !!errorRange.value || !form.value.yearMonth || form.value.spaceIds.length === 0);
</script>

<template>
  <div class="row q-col-gutter-md">
    <fieldset class="col-9">
      <p class="q-mb-sm text-body-small"> *僅可選擇已結束的月份匯出薪資資料。當月及未來月份無法匯出</p>
      <QInput
        v-model="form.yearMonth"
        label="選擇日期"
        dense
        emit-value
        map-options
        outlined
        date-mode
        month-calendar
        :error="!!errorRange"
      >
        <template #append>
          <QIcon name="o_calendar_month" size="28px" class="cursor-pointer">
            <QPopupProxy v-model="showCalendar" cover transition-show="scale" transition-hide="scale">
              <QDate
                v-model="form.yearMonth"
                default-view="Years"
                mask="YYYY/MM"
                :title="form.yearMonth"
                emit-immediately
                @navigation="selectMonth"
                @click="handleClick"
              >
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
        multiple
      />
    </fieldset>
    <div class="col-12 q-mt-md">
      <QBtn color="primary" rounded label="匯出報表" :loading="isDownloading" :disabled="ifDisabled" :disable="disableSubmit" icon="o_file_download" @click="submit" />
    </div>
  </div>
</template>
