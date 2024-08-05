<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import { removeCookie, setCookie } from '@/utils/helpers';

const route = useRoute();
const router = useRouter();
const token = route.query.token;

if (token) {
  setCookie('firstToken', token);
  removeCookie('secondToken');
  router.push({ name: 'activatePassword' });
}
</script>

<template>
  <BasicLayout>
    <RouterView />
  </BasicLayout>
</template>

<style lang="scss" scoped>

</style>
