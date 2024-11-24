<script setup lang="ts">
type Signal = 0 | 1 | 2;

defineProps<{
  predicted: Signal;
  current: Signal;
}>();

const colors = ['#C2351A', '#C90', '#20AE00'];
</script>

<template>
  <div class="signal">
    <div class="signal__item">
      <div class="signal__label">預測紅綠燈</div>
      <div class="signal__lights">
        <div
          v-for="(color, idx) in colors"
          :key="idx"
          class="signal__light"
          :style="{ borderColor: color, background: idx === predicted ? color : '#fff' }"
        >
          <QIcon v-if="idx === predicted" name="check" size="18px" color="white" />
        </div>
      </div>
    </div>

    <div class="signal__separator" />

    <div class="signal__item">
      <div class="signal__label">目前紅綠燈</div>
      <div class="signal__lights">
        <div
          v-for="(color, idx) in colors"
          :key="idx"
          class="signal__light"
          :style="{ borderColor: color, background: idx === current ? color : '#fff' }"
        >
          <QIcon v-if="idx === current" name="check" size="18px" color="white" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signal {
  display: flex;
  background-color: #fff;
  border-radius: 100px;
  border: 1px solid #dbdae7;
  padding: 0 8px 0 16px;
  gap: 8px;

  &__item {
    padding: 8px 0;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__label {
    color: #1a1b21;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.25px;
  }

  &__lights {
    display: flex;
    gap: 4px;
  }
  &__light {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  &__separator {
    width: 1px;
    background-color: rgba(219, 218, 231, 1);
  }
}
</style>
