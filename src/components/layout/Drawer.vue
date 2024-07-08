<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { useUserStore } from '@/stores';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', drawerOpen: boolean): void;
}>();

const userStore = useUserStore();
const drawerOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});
const { currentMatched } = useLayoutRoute();

const drawerItems = computed(() => currentMatched.value[0].children.filter((item) => {
  if (userStore.currentSpaceType === 1) {
    return !item.meta?.gymOnly;
  }
  return item;
},
));
</script>

<template>
  <QDrawer v-if="drawerItems?.length" v-model="drawerOpen" show-if-above side="left" :width="220" class="bg-white text-black q-pl-md shadow-5">
    <QScrollArea class="fit">
      <QList>
        <QItem
          v-for="(item, idx) in drawerItems"
          :key="idx"
          v-ripple
          clickable
          :active="currentMatched[1].name === item.name"
          active-class="drawer-item--active"
          class="drawer-item"
          @click="$router.push({ name: item.name })"
        >
          <QItemSection>
            {{ item.meta?.label }}
          </QItemSection>
        </QItem>
      </QList>
    </QScrollArea>
  </QDrawer>
</template>

<style lang="scss" scoped>
.drawer-item {
  border-radius: 30px 0 0 30px;
  color: #000;
  &--active {
    background: #ddd;
  }
}
</style>
