import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { routes } from '@/router';

export function useLayoutRoute() {
  const route = useRoute();

  const currentRoute = computed(() => route.name);
  const currentMeta = computed(() => route.meta);
  const currentMatched = computed(() => route.matched.filter(route => route.name !== 'layout'));
  const navTabs = computed(() => {
    return routes.find(route => route.name === 'layout')?.children?.map(route => ({
      label: route.meta?.label as string,
      route: route.name,
      ...route,
    }));
  });

  const drawItems = computed(() => {
    return routes.find(route => route.name === 'layout')?.children
      ?.map(route => ({
        ...route,
        label: route.meta?.label as string,
        route: route.name,
        icon: route.meta?.icon as string,
        children: route.children?.map(route => ({
          ...route,
          label: route.meta?.label as string,
          route: route.name,
        })),
        // ...route,
      }));
  });

  return {
    currentRoute,
    currentMatched,
    currentMeta,
    navTabs,
    drawItems,
  };
}
