<script setup lang="ts">
import { UserSettingForm } from '@/components/userSettings';
</script>

<template>
  <UserSettingForm type="add" @submit="$router.push({ name: 'resendActivationEmail' })" />
</template>

<style lang="scss" scoped></style>
