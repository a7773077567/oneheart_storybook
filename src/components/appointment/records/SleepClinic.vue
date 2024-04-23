<script setup lang="ts">
import type { ClientSchedule } from '@/api';

defineProps<{
  scheduleId: number;
  scheduleDetail: ClientSchedule;
}>();
</script>

<template>
  <div class="sleep_record">
    <p class="q-mb-md">
      {{ scheduleDetail.date }}
    </p>
    <form>
      <fieldset>
        <legend>客戶問題描述</legend>
        <OInput name="personalHealthStatus" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>評估狀態</legend>
        <OInput name="nutritionistAdvice" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>產品描述</legend>
        <OInput name="nutritionistAdvice" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <legend>備註</legend>
        <OInput name="nutritionistAdvice" type="textarea" class="input__item" hide-bottom-space />
      </fieldset>
      <fieldset>
        <OFile name="attachment" label="選擇檔案" @update:model-value="" />
      </fieldset>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.nusleepecord {
  form > fieldset {
    legend {
      margin-bottom: 4px;
      font-size: 14px;
    }
    & + fieldset {
      margin-top: 16px;
    }
  }
}
</style>
