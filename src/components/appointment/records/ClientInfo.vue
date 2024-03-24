<script setup lang="ts">
const data = [
  { label: '姓名', value: '王小姐' },
  { label: '電話', value: '0900-000-000' },
  { label: '地址', value: '台中市西屯區青海路' },
  { label: '日期', value: '2024/01/23' },
  { label: '時間', value: '下午15:00-下午16:00' },
  { label: '地點', value: '桃園物理治療' },
  { label: '醫師', value: 'AA治療師' },
];

const states = [
  { label: '狀態', value: '預約改期' },
  { label: '更改時間', value: '2024/01/03' },
  { label: '更改人帳號', value: 'example@gmail.com' },
];
</script>

<template>
  <div class="client-info">
    <div class="client-info__header">
      <p class="member-id">
        <span>會員編號</span><span>201712879733</span>
      </p>
    </div>
    <div class="client-info__body">
      <ul class="table">
        <template
          v-for="(item, idx) in data"
          :key="idx"
        >
          <li class="table__item">
            {{ item.label }}
          </li>
          <li class="table__item">
            {{ item.value }}
          </li>
          <QSeparator color="black" class="table__separator" />
        </template>
      </ul>
    </div>
    <div class="client-info__caption">
      <div class="state">
        <p
          v-for="(state, idx) in states"
          :key="idx"
          class="state__item"
        >
          <span>{{ state.label }}：</span>
          <span class="state__value">{{ state.value }}</span>
        </p>
      </div>
    </div>
    <div class="client-info__action">
      <QBtn label="報到" outline style="width: 127px;" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.client-info {
  &__header {
    margin-bottom: 15px;
  }
  &__caption {
    margin-bottom: 65px;
  }
  &__action {
    display: flex;
    justify-content: flex-end;
  }
}

.member-id {
  display: flex;
  gap: 13px;
  padding: 10px;
}

.table {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 25px;
  &__item {
    padding: 10px;
  }
  &__separator {
    grid-column: span 3;
    margin-bottom: 15px;
  }
}

.state {
  display: flex;
  gap: 20px;
  font-size: 12px;
  &__item {
    display: flex;
    gap: 10px;
  }
  &__value {
    color: #e86969;
  }
}
</style>
