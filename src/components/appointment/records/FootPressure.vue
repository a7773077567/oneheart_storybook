<script setup lang="ts">
import { useForm } from 'vee-validate';

const fileInputs = [
  { label: '選擇靜態足壓檔案', name: 'staticFootPressure' },
  { label: '選擇動態足壓檔案', name: 'dynamicFootPressure' },
];

const { handleSubmit } = useForm();
const onSubmit = handleSubmit((values) => {
  console.log('🚀  onSubmit  values:', values);
});
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>2024/01/23</div>
    </div>
    <div class="form__body">
      <div class="row q-gutter-xl">
        <OFile v-for="(item, idx) in fileInputs" :key="idx" :label="item.label" :name="item.name" />
      </div>
      <InputBox label="備註" label-weight="400">
        <OInput name="notes" type="textarea" />
      </InputBox>
    </div>
    <div class="form__actions">
      <QIcon name="o_save" size="24px" class="cursor-pointer q-pa-xs" />
      <QBtn label="完成服務" outline style="width: 126px;height: 40px;" @click="onSubmit" />
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
