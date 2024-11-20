<script setup lang="ts">
defineEmits<{
  (e: 'changeShift'): void;
}>();
</script>

<template>
  <div class="reminder">
    <QIcon class="reminder__icon" name="o_notifications" size="20px" />
    <p class="reminder__text">記得完成交班呦！</p>
    <QBtn class="reminder__btn" padding="10px 16px" label="交班" color="primary" />
  </div>
</template>

<style lang="scss" scoped>
.reminder {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fddda9;
  &__icon {
    padding: 8px;
    background-color: rgba(223, 108, 1, 0.16);
    border-radius: 50%;
    color: rgba(231, 93, 0, 1);
  }
  &__text {
    flex-grow: 1;
    color: #1a1b21;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.5px;
  }
  &__btn {
    border-radius: 100px;
  }
}
</style>
