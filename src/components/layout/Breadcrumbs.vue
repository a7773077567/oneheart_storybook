<script setup lang="ts">
import { ref, watch } from 'vue';
import type { RouteRecordName } from 'vue-router';
import { useLayoutRoute } from '@/composables/layoutRoute';

interface Crumb {
  name?: RouteRecordName;
  label: string;
}

const { currentRoute, currentMatched, currentMeta } = useLayoutRoute();
const crumbList = ref<Crumb[]>();

watch(currentRoute, getCrumbs, { immediate: true });

function getCrumbs() {
  const crumbs = currentMatched.value.map<Crumb>(route => ({
    name: route.name,
    label: route.meta.customLabel ? currentMeta.value.label as string : route.meta.label as string,
  }));
  crumbList.value = crumbs;
}
</script>

<template>
  <QBreadcrumbs separator=">">
    <QBreadcrumbsEl
      v-for="({ name, label }, idx) in crumbList"
      :key="idx"
      :label="label"
      :to="{ name }"
    />
  </QBreadcrumbs>
</template>

<style lang="scss" scoped>

</style>
