<script setup lang="ts">
import { spaceLogin } from '@/api/user';
import { useUserStore } from '@/stores';
import { setCookie } from '@/utils/helpers';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const spaceId = userInfo.value!.spaces[0].id;
const { accessToken: secondToken } = await spaceLogin({ spaceId });
setCookie('secondToken', secondToken);

router.push({ name: 'home' });
</script>

<template>
  Space login
</template>

<style lang="scss" scoped>

</style>
