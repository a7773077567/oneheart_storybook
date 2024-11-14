<script setup lang='ts'>
import { ref } from 'vue';
import { ScheduleVisitState } from '@/const/appointment';

const props = defineProps<{
  clientName: string;
  initVal: boolean;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', state: ScheduleVisitState): void;
}>();

const state = ref(props.initVal ? ScheduleVisitState['初診'] : ScheduleVisitState['複診']);
</script>

<template>
  <QCard class="first_schedule_form">
    <QCardSection>
      <h2 class="first_schedule_form--title">編輯初診狀態</h2>
    </QCardSection>
    <QCardSection class="q-py-lg">
      <div class="client_name q-mb-md">客戶 <span>{{ clientName }}</span></div>
      <QList separator dense>
        <QItem>
          <QItemSection>初診</QItemSection>
          <QItemSection>
            <QRadio v-model="state" left-label :val="ScheduleVisitState['初診']" />
          </QItemSection>
        </QItem>
        <QItem>
          <QItemSection>複診</QItemSection>
          <QItemSection>
            <QRadio v-model="state" left-label :val="ScheduleVisitState['複診']" />
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
    <QCardActions class="q-pa-lg">
      <QBtn label="取消" @click="$emit('cancel')" />
      <QBtn label="確定" color="black" @click="$emit('confirm', state)" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.first_schedule_form {
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
