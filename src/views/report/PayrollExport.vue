<script setup lang='ts'>
import { computed, ref } from 'vue';
import { exportSalaryReport } from '@/api';
import dayjs from 'dayjs';
import { useOptionStore } from '@/stores';
import YearMonthSelect from '@/components/shared/YearMonthSelect.vue';

const optionStore = useOptionStore();
const spaceOptions = computed<{ label: string; value: number }[]>(() => optionStore.spaceList.map(space => ({ label: space.name, value: space.id })));

const form = ref<{ yearMonth: { year: number; month: number }[]; spaceIds: number[] }>({
  yearMonth: [],
  spaceIds: [],
});

const ifDisabled = computed(() => Object.values(form.value).some(field => !field));
const isDownloading = ref(false);
async function submit() {
  if (ifDisabled.value)
    return;
  isDownloading.value = true;
  try {
    await Promise.allSettled(form.value.yearMonth.map(({ year, month }) => exportSalaryReport({
      yearMonth: `${year}/${String(month).padStart(2, '0')}`,
      spaceIds: form.value.spaceIds,
    })));
  }
  catch (error) {
    console.log(error);
  }
  finally {
    isDownloading.value = false;
  }
}

const errorRange = computed(() => form.value.yearMonth.some(({ year, month }) => dayjs(`${year}/${month}`, 'YYYY/M').isSameOrAfter(undefined, 'month')));
const disableSubmit = computed(() => !!errorRange.value || form.value.yearMonth.length === 0 || form.value.spaceIds.length === 0);
</script>

<template>
  <div class="row q-col-gutter-md">
    <fieldset class="col-9">
      <p class="q-mb-sm text-body-small"> *僅可選擇已結束的月份匯出薪資資料。當月及未來月份無法匯出</p>
      <YearMonthSelect v-model="form.yearMonth" />
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

<style scoped lang="scss">
:deep(.input) {
  border: 1px solid rgba(0, 0, 0, 0.24) !important;
  .input__text {
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
