<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps<{
  clientName: string;
  initVal: boolean;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', state: boolean): void;
}>();

const state = ref(Number(props.initVal));
</script>

<template>
  <QCard class="employee_price_form">
    <QCardSection>
      <h2 class="employee_price_form--title">編輯員工價狀態</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <div class="client_name q-mb-md">客戶 <span>{{ clientName }}</span></div>
      <QList separator dense>
        <QItem>
          <QItemSection>是</QItemSection>
          <QItemSection>
            <QRadio v-model="state" left-label :val="1" />
          </QItemSection>
        </QItem>
        <QItem>
          <QItemSection>否</QItemSection>
          <QItemSection>
            <QRadio v-model="state" left-label :val="0" />
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
    <QCardActions class="q-pa-lg">
      <QBtn label="取消" @click="$emit('cancel')" />
      <QBtn label="確定" color="black" @click="$emit('confirm', !!state)" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.employee_price_form {
  width: 312px;
  &--title {
    font-size: 24px;
    font-weight: 500;
  }
  .client_name {
    font-size: 18px;
    font-weight: 500;
  }
  .q-list--dense > .q-item {
    padding: 12px 4px;
  }
}
</style>
