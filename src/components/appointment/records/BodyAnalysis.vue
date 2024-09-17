<script setup lang="ts">
import type { ClientScheduleDetail } from '@/api';
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const inBodies = computed(() => {
  const { inBodyFileUrls, inBodyFiles } = props.scheduleDetail.client;
  if (!inBodyFileUrls) {
    return [];
  }
  return inBodyFileUrls.map((url, idx) => ({
    url,
    date: dayjs(inBodyFiles[idx].createdAt).format('YYYY/MM/DD'),
  }));
});
</script>

<template>
  <div class="body-analysis">
    <p v-if="!inBodies.length">無身體組成量測紀錄</p>
    <div v-for="(inBody, idx) in inBodies" :key="idx" class="body-analysis__item">
      <div class="img">
        <div class="img__date">{{ inBody.date }}</div>
        <div class="img__item">
          <img :src="inBody.url">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.img {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__item {
    max-width: 800px;
    height: auto;
    > img {
      width: 100%;
    }
  }
}
</style>
