<script setup lang="ts">
import { UserSettingForm } from '@/components/userSettings';
import { useUserStore } from '@/stores';

const props = defineProps<{
  userId: string;
}>();

const userStore = useUserStore();
await userStore.getUser(+props.userId);
</script>

<template>
  <UserSettingForm type="edit" :user-id="userId" />
</template>

<style lang="scss" scoped>

</style>
