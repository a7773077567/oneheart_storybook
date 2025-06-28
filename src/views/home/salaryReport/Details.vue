<script setup lang="ts">
import { useSalaryReportStore, useUserStore } from '@/stores';
import { RouterLink, RouterView } from 'vue-router';

const userStore = useUserStore();
const salaryStore = useSalaryReportStore();

// reset authentication to ensure whenever we enter this page, we need to re-authenticate
salaryStore.isAuthenticated = false;
</script>

<template>
  <div class="details">
    <div v-if="userStore.canI('EDIT_SALARY_REPORT')" class="details__header">
      <div class="row q-gutter-lg">
        <RouterLink :to="{ name: 'salaryReportTherapist' }">salaryReportTherapist</RouterLink>
        <RouterLink :to="{ name: 'salaryReportCoach' }">salaryReportCoach</RouterLink>
        <RouterLink :to="{ name: 'salaryReportCounter' }">salaryReportCounter</RouterLink>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>

</style>
