<script setup lang="ts">
import { RoleType } from '@/api';
import { OptionSelect } from '@/components/shared';
import { RoleInfo } from '@/const/general';
import { useSalaryReportStore, useUserStore } from '@/stores';
import { ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

const userStore = useUserStore();
const salaryStore = useSalaryReportStore();
const router = useRouter();

await userStore.getUsers();

// reset authentication to ensure whenever we enter this page, we need to re-authenticate
salaryStore.isAuthenticated = false;

const currentEmployee = ref(userStore.activeSalaryUsers[0].value);

if (RoleType[userStore.role] === '系統管理者') {
  watch(currentEmployee, (newVal) => {
    const roleType = userStore.users.find(user => user.id === newVal)!.role.type;
    const targetRoute = RoleInfo[roleType].salaryRoute;

    router.push({
      name: targetRoute,
      query: {
        employeeId: currentEmployee.value,
      },
    });
  }, { immediate: true });
}
</script>

<template>
  <div class="details">
    <div v-if="userStore.canI('EDIT_SALARY_REPORT')" class="details__header">
      <OptionSelect
        v-model="currentEmployee"
        :options="userStore.activeSalaryUsers"
      />
    </div>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>

</style>
