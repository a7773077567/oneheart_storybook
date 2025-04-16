<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutRoute } from '@/composables/layoutRoute';
import { useUserStore } from '@/stores';
import type { PermissionEvents } from '@/const/permission';

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
const { currentMatched, drawItems } = useLayoutRoute();

// const drawerItems = computed(() => currentMatched.value[0].children);
const permissionControlTabs = computed(() => {
  const canViewPage = (permission: PermissionEvents) => {
    return userStore.canI(permission);
  };
  let _filteredPages = drawItems.value?.map((group) => {
    // permission control
    if (group && group.children) {
      return ({ ...group, children: group?.children?.filter(subpage => !subpage.meta?.hide).filter((child) => {
        if (child?.meta?.permissions) {
          return (child.meta.permissions as PermissionEvents[]).every(canViewPage);
        }
        return true;
      }) });
    }
    return group;
  }).filter(route => route.meta?.permissions ? (route.meta.permissions as PermissionEvents[]).every(canViewPage) : true) ?? [];

  return _filteredPages;
});

function isRouteFocused(route: string) {
  return currentMatched.value.some(e => e.name === route);
}
</script>

<template>
  <QDrawer v-if="permissionControlTabs?.length" v-model="drawerOpen" show-if-above side="left" :width="288" class="drawer">
    <QScrollArea class="fit">
      <QList>
        <QExpansionItem
          v-for="tab in permissionControlTabs"
          :key="tab.label"
          :label="tab.label"
          :icon="tab.icon"
          dense-toggle
          :model-value="isRouteFocused(tab.route as string)"
        >
          <QItem
            v-for="item in tab.children"
            :key="item.label"
            :to="{ name: item.route }"
            clickable
            :focused="isRouteFocused(item.route as string)"
          >
            <QItemSection>
              <QItemLabel>
                {{ item.label }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QExpansionItem>
      </QList>

      <!-- <QList>
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
      </QList> -->
    </QScrollArea>
  </QDrawer>
</template>

<style lang="scss" scoped>
:deep(.q-drawer__content) {
  padding: 12px;
  background-color: $surface;
}

.drawer-item {
  border-radius: 30px 0 0 30px;
  color: #000;
  &--active {
    background: #ddd;
  }
}

:deep(.q-expansion-item__container > .q-item) {
  padding: 16px 24px 16px 16px;
  border-radius: 100px;
  .q-item__section--avatar {
    min-width: fit-content;
  }
}

:deep(.q-expansion-item__content) {
  padding-left: 32px;
}

:deep(.q-expansion-item__content > .q-item) {
  padding: 18px 24px;
  border-radius: 100px;
}

:deep(.q-item__label) {
  @include text-style($label-large, $on-surface-variant);
  line-height: 20px !important;
}

:deep(.q-manual-focusable--focused) {
  .q-item__label {
    color: $on-secondary-container;
    font-weight: 700;
  }
}

:deep(.q-item .q-icon) {
  color: $on-surface-variant;
}
</style>
