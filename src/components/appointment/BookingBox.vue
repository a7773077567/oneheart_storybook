<script setup lang="ts">
import { ref } from 'vue';

defineEmits<{
  book: [];
}>();

const phoneData = [
  { key: '會員電話', value: '0900-000-011', slotName: 'phone' },
];
const chooseData = [
  { key: '選擇會員', slotName: 'pick' },
];
const clientData = [
  { key: '姓名', value: '林小姐' },
  { key: '電話', value: '0900-000-011' },
  { key: '地址', value: '台中市西屯區青海路' },
];
const bookingInfo = [
  { key: '日期', value: '2024/01/23' },
  { key: '時間', value: '下午14:00-下午15:00' },
  { key: '項目', value: '足壓科' },
  { key: '地點', value: '桃園物理治療' },
  { key: '治療師', value: 'AA治療師' },
];

const isStaffPrice = ref(false);
</script>

<template>
  <QCard style="width: 757px;">
    <QCardActions align="right" class="q-pa-none">
      <QIcon v-close-popup name="close" size="24px" class="cursor-pointer q-pa-sm" />
    </QCardActions>
    <QCardSection class="column q-gutter-sm">
      <OCheckbox
        v-model="isStaffPrice"
        label="員工價"
        left-label
        class="self-start q-pa-sm"
      />
      <OTable :data="phoneData">
        <template #phone>
          <div class="row justify-between items-center">
            <span>0900-000-011</span>
            <QBtn label="查詢" outline dense padding="3px 26px" />
          </div>
        </template>
      </OTable>
      <OTable :data="chooseData">
        <template #pick>
          <div class="row items-center q-gutter-sm">
            <QBtn label="林小姐" outline dense padding="3px 26px" />
            <QBtn label="王先生" outline dense padding="3px 26px" />
          </div>
        </template>
      </OTable>
      <span class="q-pa-sm">會員編號 201612889734 </span>
      <OTable :data="clientData" />
      <OTable :data="bookingInfo" />
      <QBtn label="預約" class="self-end" outline dense padding="10px 46px" @click="$emit('book')" />
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
