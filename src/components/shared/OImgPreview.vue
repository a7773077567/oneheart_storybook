<script setup lang='ts'>
defineProps<{
  url: string;
}>();

defineEmits<{
  (e: 'remove'): void;
}>();
</script>

<template>
  <div class="o_img_preview">
    <img :src="url" alt="attachment">
    <div class="remove_icon" @click="$emit('remove')">
      <QIcon name="o_clear" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.o_img_preview {
  width: 100%;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .remove_icon {
    position: absolute;
    top: 4px;
    right: 4px;
    left: 0;
    margin-left: auto;
    width: 40px;
    height: 40px;
    background: $secondary-container;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-items: center;
    cursor: pointer;
  }
  .q-icon {
    width: 100%;
    height: 100%;
    font-size: 24px;
    font-weight: 700;
  }
}
</style>
