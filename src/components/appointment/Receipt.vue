<script setup lang="ts">
import { useAppointmentStore } from '@/stores';
import { computed } from 'vue';

const props = defineProps<{
  data: {
    name: string;
    gender: string;
    id: string;
    birthDate: string;
    amount: number;
    declaration: string;
    selfPay: string;
    date: string;
    userName: string;
  };
  spaceName?: string;
}>();

const appointmentStore = useAppointmentStore();

const LabelMap = new Map<keyof typeof props.data, string>([
  ['name', '姓名'],
  ['gender', '姓別'],
  ['id', '身分證字號'],
  ['birthDate', '出生年月日'],
  ['declaration', '健保申報'],
  ['selfPay', '自費項目'],
  ['date', '看診日期'],
  ['userName', '治療師'],
  ['amount', '現金'],
]);

const spaceName = computed(() => appointmentStore.targetClientSchedule?.userShift.space?.name);
</script>

<template>
  <div class="receipt">
    <p class="receipt__title">
      {{ spaceName }}
    </p>
    <p class="receipt__subtitle">
      醫療費用收據（客戶聯）
    </p>
    <div class="receipt__body">
      <table class="table">
        <tr v-for="[key, val] in LabelMap.entries()" :key="key">
          <td>{{ val }}</td>
          <td>{{ data[key] }}</td>
        </tr>
      </table>
    </div>
    <div class="receipt__stamp">
      <img src="@/assets/images/appointment/duty-stamp.png" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
%cell-style {
  border: 1px solid black;
  font-size: 15px;
  font-weight: 500;
  padding: 5px;
}

.receipt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 338px;
  padding: 30px;
  border: 1px solid black;
  &__title {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    > span {
      font-size: 15px;
      font-weight: 500;
    }
  }
  &__subtitle {
    text-align: center;
  }
  &__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__stamp {
    bottom: 30px;
    width: 200px;
    img {
      width: 100%;
    }
  }
}

.table {
  width: 100%;
  border: 1px solid black;
  border-spacing: 3px;
  border-collapse: separate;
  th {
    @extend %cell-style;
  }
  td {
    @extend %cell-style;
  }
}
</style>
