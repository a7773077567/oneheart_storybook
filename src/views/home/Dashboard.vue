<script setup lang='ts'>
import { useUserStore } from '@/stores';
import { RoleType } from '@/api/user';
import { computed } from 'vue';
import AdminDashboard from '@/views/home/AdminDashboard.vue';
import TherapistDashboard from '@/views/home/TherapistDashboard.vue';
import LeadTherapistDashboard from '@/views/home/LeadTherapistDashboard.vue';
import ReceptionDashboard from '@/views/home/ReceptionDashboard.vue';
import CoachDashboard from '@/views/home/CoachDashboard.vue';
import { useLayoutRoute } from '@/composables/layoutRoute';

const { currentRoute } = useLayoutRoute();
function getRoleDashboard(role: RoleType) {
  switch (role) {
    case RoleType['院長']:
    case RoleType['副院長']:
    case RoleType['系統管理者']:
      return AdminDashboard;
    case RoleType['物理治療師']:
      return TherapistDashboard;
    case RoleType['物理治療師組長']:
      return LeadTherapistDashboard;
    case RoleType['櫃檯']:
      return ReceptionDashboard;
    case RoleType['教練']:
    case RoleType['教練組長']:
    case RoleType['店長']:
    case RoleType['副店長']:
    default:
      return CoachDashboard;
  }
}

const userStore = useUserStore();
const dashboardComponent = computed(() => getRoleDashboard(userStore.role));
</script>

<template>
  <Component :is="dashboardComponent" v-if="currentRoute === 'dashboard'" />
  <RouterView v-else />
</template>
