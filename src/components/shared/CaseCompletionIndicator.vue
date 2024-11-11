<script setup lang="ts">

</script>

<template>
  <div class="case-completion-indicator">
    <div class="case-completion-indicator__item--complete">病例已完成</div>
    <div class="case-completion-indicator__item--incomplete">病例已完成</div>
  </div>
</template>

<style lang="scss" scoped>
.case-completion-indicator {
  display: flex;
  gap: 16px;
  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #1a1833;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      border: 1px solid rgba(219, 218, 231, 1);
      border-radius: 50%;
    }
    &--complete {
      @extend .case-completion-indicator__item;
      &::before {
        background-color: rgba(223, 234, 252, 1);
      }
    }
    &--incomplete {
      @extend .case-completion-indicator__item;
      &::before {
        background-color: rgba(252, 231, 229, 1);
      }
    }
  }
}
</style>
