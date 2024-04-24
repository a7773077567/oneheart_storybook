<script setup lang="ts">
import type { HistoryChiefComplaint } from '@/api';
import dayjs from 'dayjs';

defineProps<{
  data: HistoryChiefComplaint[];
}>();
defineEmits<{
  choose: [history: HistoryChiefComplaint];
}>();
</script>

<template>
  <QCard style="width: 440px; height: 612px;">
    <QCardSection>
      <QList class="column q-gutter-md">
        <QItem v-for="(item, idx) in data" :key="idx" clickable @click="$emit('choose', item)">
          <QItemSection>
            <QItemLabel class="q-mb-xs">
              {{ dayjs(item.date).format('YYYY/MM/DD') }}
            </QItemLabel>
            <QItemLabel style="height: 137px;overflow: scroll; border: 1px solid black; padding: 10px;">
              {{ item.chiefComplaint }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>

</style>
