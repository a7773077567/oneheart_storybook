<script setup lang="ts">
import { useForm } from 'vee-validate';
import { ref } from 'vue';

const data: DataItem[] = [
  { name: 'chiefComplain', label: '主訴', showCopyBtn: true },
  { name: 'assessmentResults', label: '評估結果' },
  { name: 'treatmentPlan', label: '治療計畫' },
  { name: 'treatmentNotes', label: '治療備註' },
  { name: 'forExerciseGroup', label: '給運動組的建議' },
  { name: 'forFrontDesk', label: '給櫃檯的建議' },
];
const stateOfHistoryDialog = ref(false);

const { handleSubmit } = useForm();
const onSubmit = handleSubmit((values) => {
  console.log(values);
});

interface DataItem {
  name: string;
  label?: string;
  showCopyBtn?: boolean;
}

function openHistoryDialog() {
  stateOfHistoryDialog.value = true;
}

function pasteHistory() {
  stateOfHistoryDialog.value = false;
}
</script>

<template>
  <div class="form">
    <div class="form__header">
      <div>2024/01/23</div>
    </div>
    <div class="form__body">
      <div v-for="(item, idx) in data" :key="idx" class="input">
        <div class="input__label">
          <span>{{ item.label }}</span>
          <QIcon v-if="item.showCopyBtn" name="o_folder" size="20px" class="cursor-pointer q-pa-xs" @click="openHistoryDialog" />
        </div>
        <OInput :name="item.name" type="textarea" class="input__item" hide-bottom-space />
      </div>
      <OFile name="attachment" label="選擇檔案" />
    </div>
    <div class="form__actions">
      <QIcon name="o_save" size="24px" class="cursor-pointer q-pa-xs" />
      <QBtn label="完成服務" outline style="width: 126px;height: 40px;" @click="onSubmit" />
    </div>
    <QDialog v-model="stateOfHistoryDialog">
      <QCard style="width: 440px; height: 612px;">
        <QCardSection>
          <QList class="column q-gutter-md">
            <QItem clickable @click="pasteHistory">
              <QItemSection>
                <QItemLabel class="q-mb-xs">
                  2024/01/23
                </QItemLabel>
                <QItemLabel style="height: 137px;overflow: scroll; border: 1px solid black; padding: 10px;">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo minus eius excepturi tempora aperiam tempore? Est quo aliquid magni, deleniti nobis facere veniam voluptates molestiae voluptatum alias? Delectus, saepe reprehenderit? lorem
                </QItemLabel>
              </QItemSection>
            </QItem>
          </QList>
        </QCardSection>
      </QCard>
    </QDialog>
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
