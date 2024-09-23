<script setup lang='ts'>
defineProps<{
  list: string[];
}>();
</script>

<template>
  <ul class="price_tags">
    <li v-for="item in list" :key="item">
      <QIcon name="o_discount" />
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.price_tags {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 12px;
  text-align: right;
  li {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #558c4a;
    gap: 8px;
  }
}
</style>
