<script setup lang="ts">
import { BookingQueryItem } from '@/components/appointment';
import { getMockClientSchedule } from '@/mocks/mockFunctions';

const mockClientSchedules = [...Array(5).keys()].map(getMockClientSchedule);
</script>

<template>
  <div class="query">
    <div class="query__header">
      <div class="nav">
        <div class="nav__item">
          <span>客戶電話</span>
          <OInput class="nav__input" name="phone" hide-bottom-space />
        </div>
        <div class="nav__item">
          <span>客戶姓名</span>
          <OInput class="nav__input" name="name" hide-bottom-space />
        </div>
        <p class="nav__item--end">
          客戶電話與姓名擇一必填
        </p>
        <div class="nav__item">
          <span>選擇項目</span>
          <OSelect class="nav__input" name="type" hide-bottom-space />
        </div>
        <div class="nav__item">
          <span>預約日期</span>
          <OSelect class="nav__input" name="date" hide-bottom-space />
        </div>
        <div class="nav__item--end">
          <QBtn label="查詢預約" outline padding="10px 30px" />
          <QBtn label="清除" outline padding="10px 30px" />
        </div>
      </div>
    </div>
    <div class="query__body">
      <BookingQueryItem
        v-for="(item, idx) in mockClientSchedules"
        :key="idx"
        :data="item"
        history-mode
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.query {
  &__body {
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
.nav {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 281px) auto;
  align-items: center;
  column-gap: 24px;
  row-gap: 20px;
  padding: 10px;
  &__item {
    display: flex;
    align-items: center;
    gap: 6px;
    &--end {
      @extend .nav__item;
      justify-self: end;
      padding-left: 30px;
    }
  }
  &__input {
    flex: 1 1 auto;
  }
}
</style>
