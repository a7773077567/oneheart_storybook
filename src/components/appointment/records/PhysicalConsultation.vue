<script setup lang="ts">
import { useForm } from 'vee-validate';

const { handleSubmit } = useForm();
const onSubmit = handleSubmit((values) => {
  console.log(values);
});

interface DataItem {
  title: string;
  items: {
    name: string;
    label: string;
    showCopyBtn?: boolean;
  }[];
}
const data: DataItem[] = [
  {
    title: '基本資料',
    items: [{ name: 'chiefComplain', label: '主訴', showCopyBtn: true }, { name: 'pastHistory', label: '病史' }, { name: 'occupationType', label: '職業類型/生活型態' }, { name: 'exerciseHabits', label: '運動習慣' }, { name: 'others', label: '其他' }],
  },
  {
    title: '理學檢查',
    items: [{ name: 'clinicalObservation', label: '臨床觀察' }, { name: 'palpation', label: '觸診' }, { name: 'movementAssessment', label: '動作測試' }],
  },
  {
    title: '評估',
    items: [{ name: 'problemSummary', label: '問題總結' }],
  },
  {
    title: '治療計畫',
    items: [{ name: 'treatmentNotes', label: '治療備註' }],
  },
  {
    title: '建議',
    items: [{ name: 'forExerciseGroup', label: '給運動組的建議' }],
  },

];
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>2024/01/23</div>
    </div>
    <div class="form__body">
      <div v-for="({ items, title }, idx) in data" :key="idx" class="group">
        <p class="group__title">
          {{ title }}
        </p>
        <div class="group__body">
          <div v-for="(item, itemIdx) in items" :key="itemIdx" class="input">
            <div class="input__label">
              <span>{{ item.label }}</span>
              <QIcon v-if="item.showCopyBtn" name="o_folder" size="20px" class="cursor-pointer q-pa-xs" />
            </div>
            <OInput :name="item.name" type="textarea" class="input__item" hide-bottom-space />
          </div>
        </div>
      </div>
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

.group {
  &__title {
    padding: 15px 0 5px 0;
    border-bottom: 3px solid #79747e;
    margin-bottom: 15px;
    font-weight: 500;
  }
  &__body {
    display: flex;
    flex-direction: column;
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
