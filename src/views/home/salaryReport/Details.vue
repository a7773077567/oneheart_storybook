<script setup lang="ts">
import { useSalaryReportStore } from '@/stores';

const salaryStore = useSalaryReportStore();
salaryStore.isAuthenticated = false;
</script>

<template>
  Details
</template>

<style lang="scss" scoped>

</style>
