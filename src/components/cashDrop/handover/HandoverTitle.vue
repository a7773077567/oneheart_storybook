<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  mode: 'expenses' | 'incomes';
}>();

const title = computed(() => props.mode === 'expenses' ? '請填寫細項支出' : '請填寫其他收入');
const subtitle = computed(() => props.mode === 'expenses' ? '細項包含水電費、瓦斯費、郵費、貨運費、雜支...' : '包含商品販售等非預約診療費用');
</script>

<template>
  <div class="handover-title">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<style lang="scss" scoped>
.handover-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.1px;
}

.subtitle {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
}
</style>
