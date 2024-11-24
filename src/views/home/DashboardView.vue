<script setup lang="ts">
import { CaseStatusMap } from '@/const/dashboard';
import { TherapistOverview } from '@/components/home/dashboard';
import { computed } from 'vue';

const caseStatusData = Object.values(CaseStatusMap).reduce((acc: any, item, idx) => {
  acc.labels = [...(acc.label ?? []), item.label];
  acc.data = [...(acc.data ?? []), 5 + (idx * 3)];
  acc.backgroundColor = [...(acc.backgroundColor ?? []), item.color];
  return acc;
}, {});

const caseStatusInfoData = Object.values(CaseStatusMap).map((item, idx) => {
  const { color, label } = item;
  return {
    color,
    label,
    values: [
      `${5 + (idx * 3)}件`,
      `${((5 + (idx * 3)) / 55).toFixed(2) * 100}%`,
    ],
  };
});

const caseStatus = computed(() => {
  return {
    title: '病例狀態',
    subtitle: '總時數 28 hr',
    chartData: caseStatusData,
    infoData: caseStatusInfoData,
  };
});
</script>

<template>
  <main>
    <TherapistOverview :case-status="caseStatus" :checkout-plan="caseStatus" />
  </main>
</template>
