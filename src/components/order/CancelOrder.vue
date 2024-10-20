<script setup lang='ts'>
interface Detail {
  date: string;
  clientName: string;
  item: string;
  amount: number;
}
defineProps<{
  data: Detail;
}>();
defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', data: Detail): void;
}>();
</script>

<template>
  <QCard style="width:312px; max-width: 312px;">
    <QCardSection class="text-center card__header">
      <h2 class="text-h6 text-bold">取消交易</h2>
    </QCardSection>
    <QCardActions vertical class="q-pa-lg form__content">
      <p class="q-mb-md">取消交易後，此預約單將會回到「未結帳」狀態。</p>
      <ul class="cancel_content">
        <li class="text-weight-medium">日期：{{ data.date }}</li>
        <li class="text-weight-medium">會員姓名：{{ data.clientName }}</li>
        <li class="text-weight-medium">項目：門診費用</li>
        <li class="text-weight-medium">金額：${{ data.amount }}</li>
      </ul>
    </QCardActions>
    <QCardActions class="q-pa-lg form__action">
      <QBtn label="取消並返回" color="black" @click="$emit('cancel')" />
      <QBtn label="確定取消交易" outlined @click="$emit('confirm', data)" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.cancel_content {
  li + li {
    margin-top: 8px;
  }
}
</style>
