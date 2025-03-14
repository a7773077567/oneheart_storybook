<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps<{
  current: number;
}>();

const content = computed(() => {
  switch (true) {
    case props.current < 40:
      return { text: `離綠燈還差 ${60 - props.current} 分!\n這個月再努力一下!`, color: '#DF5458' };
    case props.current >= 40 && props.current < 60 :
      return { text: `離綠燈只差 ${60 - props.current} 分! \n 目標在望囉！`, color: '#dba100' };
    case props.current >= 60:
    default:
      return { text: '綠燈達標! \n 保持穩定，挑戰更高目標吧！', color: '#008524' };
  }
});
</script>

<template>
  <div class="cheer_container" :style="{ 'background-color': content.color }">
    {{ content.text }}
    <div class="cheer_triangle" :style="{ 'border-right-color': content.color }" />
  </div>
</template>

<style scoped lang="scss">
.cheer_container {
  position: relative;
  border-radius: 8px;
  padding: 2px 16px;
  height: fit-content;
  white-space: break-spaces;
  @include body-medium($inverse-on-surface);
  .cheer_triangle {
    position: absolute;
    content: '';
    left: -12px;
    top: 0;
    right: 100%;
    bottom: 0;
    margin: auto 0;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 12px solid transparent;
  }
}
</style>
