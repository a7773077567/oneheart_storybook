<script setup lang='ts'>
defineProps<{
  rules: { score: number; min: number; max: number | null }[];
  unit?: string;
}>();
</script>

<template>
  <ul class="rule_list">
    <li v-for="(rule, idx) in rules" :key="idx" class="rule_item">
      {{ rule.score }} 分：
      <template v-if="rule.min === 0">
        數值 &#60; {{ rule.max }} {{ unit && unit }}
      </template>
      <template v-else-if="rule.max === null">
        {{ rule.min }} &#8804; 數值
      </template>
      <template v-else>
        {{ rule.min }} &#8804; 數值 &#60; {{ rule.max }} {{ unit && unit }}
      </template>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.rule_list {
  list-style-position: inside;
  list-style-type: disc;
  li {
    line-height: 1.6;
    vertical-align: middle;
  }
  li::marker {
    font-size: 8px; /* Adjust bullet size */
  }
}
</style>
