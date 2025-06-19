<script setup lang='ts'>
import { computed } from 'vue';
import { MachineTypes } from '@/const/general';
import Winback from '@/assets/images/winback.svg?component';
import Sis from '@/assets/images/sis.svg?component';
import Fswt from '@/assets/images/fswt.svg?component';

const props = defineProps<{
  machineType: MachineTypes;
}>();

const service = computed(() => {
  switch (props.machineType) {
    case MachineTypes['射頻儀器治療']:
      return { icon: Winback, label: '射頻' };
    case MachineTypes['磁波儀器治療']:
      return { icon: Sis, label: '磁波' };
    case MachineTypes['震波儀器治療']:
    default:
      return { icon: Fswt, label: '震波' };
  }
});
</script>

<template>
  <div class="add_on_icon text-on-surface-variant">
    <component :is="service.icon" style="size:14px" />
    <span class="text-label-small">{{ service.label }}</span>
  </div>
</template>

<style scoped lang="scss">
.add_on_icon {
  width: fit-content;
  background: rgba(58, 78, 107, 0.12);
  padding: 1px 4px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
