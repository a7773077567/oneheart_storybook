<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores';

useUserStore();

console.log(import.meta.env.MODE);

changeTitle();
function changeTitle() {
  if (import.meta.env.MODE !== 'production') {
    document.title = '(測試)唯心運動醫療體系';
  }
}
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped lang="scss">

</style>
