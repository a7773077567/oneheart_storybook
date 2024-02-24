<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores';

useUserStore();
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped lang="scss">

</style>
